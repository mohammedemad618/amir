import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import React from 'react';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const authUser = await requireAuth();

    // Find enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: authUser.userId,
          courseId: params.courseId,
        },
      },
      include: {
        course: true,
        user: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'أنت غير مسجل في هذه الدورة' },
        { status: 404 }
      );
    }

    if (enrollment.progressPercent !== 100) {
      return NextResponse.json(
        { error: 'يجب إكمال الدورة أولاً' },
        { status: 400 }
      );
    }

    // Generate certificate PDF
    // For server-side PDF generation, we'll use a different approach
    // Since @react-pdf/renderer is client-side, we'll generate a simple PDF using pdfkit
    // For now, let's return a certificate URL that can be generated client-side
    // Or we can use a server-side PDF library like pdfkit

    // For simplicity, we'll mark the certificate as generated and store a URL
    const certificateId = `CERT-${Date.now()}-${enrollment.id}`;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        certificateId,
        certificateUrl: `/certificates/${certificateId}.pdf`,
      },
    });

    // Return certificate data for client-side generation
    return NextResponse.json({
      certificate: {
        id: certificateId,
        courseTitle: enrollment.course.title,
        studentName: enrollment.user.name,
        doctorName: 'الدكتور عامر عرابي',
        completionDate: new Date().toLocaleDateString('ar-SA'),
        certificateUrl: `/certificates/${certificateId}.pdf`,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الشهادة' },
      { status: 500 }
    );
  }
}
