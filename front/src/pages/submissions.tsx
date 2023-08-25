import React from "react";
import { fetchClient, fetchServer } from "@/services/auth";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Agreement } from "./agreements";
import SubmissionCard from "@/components/Card/Submission";
import { useRouter } from "next/router";

// Generated by https://quicktype.io

export interface Submission {
  id: number;
  description: string;
  price: number;
  paid: boolean;
  paymentDate: null;
  createdAt: string;
  updatedAt: string;
  AgreementId: number;
  Agreement: Agreement;
}

export const getServerSideProps: GetServerSideProps<{
  submissions: Submission[];
}> = async (context) => {
  const res = await fetchServer("/submissions/unpaid", {}, context);
  const data = await res.json();

  return {
    props: {
      submissions: data,
    },
  };
};

const Submissions = ({
  submissions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };
  const handlePay = async (id: number) => {
    const res = await fetchClient(`/submissions/${id}/pay`, {
      method: "POST",
    });

    if (res.status === 200) {
      alert("Submission paid");
      refreshData();
    } else {
      const error = await res.json();
      alert("Error paying submission: " + error.message);
    }
  };
  return (
    <div className="inline-flex gap-4 z-0">
      {submissions.map((submission) => {
        return (
          <SubmissionCard
            key={submission.id}
            {...submission}
            handlePay={(id) => handlePay(id)}
          />
        );
      })}
    </div>
  );
};

export default Submissions;
