import Image from "next/image";

export default function InstructorForm({ instructor }: { instructor: any }) {
  return (
    <form className="bg-white rounded-xl shadow p-6 space-y-6">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#b9aaff] mb-4">
          <Image src={instructor.detailImage || instructor.image} alt={instructor.name} fill className="object-cover" />
        </div>
        <input
          className="text-2xl font-bold text-center mb-2 border-b border-gray-200 focus:outline-none"
          value={instructor.name}
          name="name"
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Experience</label>
        <input
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={instructor.experience || "5+ years"}
          name="experience"
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Courses Offered</label>
        <input
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={instructor.courses?.join(", ") || "Yoga, Meditation, Mantra"}
          name="courses"
          readOnly
        />
      </div>
      {/* Add more fields as needed */}
    </form>
  );
}
