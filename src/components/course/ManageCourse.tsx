import React from 'react';
import { z } from 'zod';

interface Props {}

// const courseScoreType = ['CGPA', 'PERCENTAGE'];
// const programDurationType = ['SEMESTER', 'YEAR'];
// const programLevel = ['UG', 'PG', 'PHD'];

export const createCourseSchema = z.object({
  instituteId: z.number(),
  departmentId: z.number(),
  programDuration: z.number(),
  branchName: z.string().min(1),
  branchCode: z.string().min(1),
  programName: z.string().min(1),
  scoreType: z.enum(['CGPA', 'PERCENTAGE']),
  programDurationType: z.enum(['SEMESTER', 'YEAR']),
  programLevel: z.enum(['UG', 'PG', 'PHD']),
});

export const ManageCourse: React.FC<Props> = () => {
  return <div></div>;
};
