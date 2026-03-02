import { notFound } from "next/navigation";
import InstructorDetails from "../../../_components/InstructorDetails";
import { instructors } from "../../../_components/instructorData";

export default function InstructorDetailsPage({ params }: { params: { name: string } }) {
  const instructor = instructors.find(
    (i) => i.name.toLowerCase().replace(/\s+/g, "-") === params.name
  );
  if (!instructor) return notFound();
  return <InstructorDetails instructor={instructor} />;
}
