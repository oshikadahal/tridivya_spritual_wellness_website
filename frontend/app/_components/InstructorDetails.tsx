import Image from "next/image";

export default function InstructorDetails({ instructor }: { instructor: any }) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow p-8 space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#b9aaff]">
            <Image src={instructor.detailImage || instructor.image} alt={instructor.name} fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">{instructor.name}</h2>
            <p className="text-lg font-semibold text-gray-700 mb-2">{instructor.title}</p>
            <p className="text-gray-600">{instructor.bio}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-6">
          <div>
            <ul className="space-y-2">
              {instructor.skills.map((skill: string) => (
                <li key={skill} className="flex items-center text-purple-700 font-medium">
                  <span className="mr-2">✔</span> {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-gray-700 font-semibold">Experience: {instructor.experience}</div>
            <div className="text-gray-600 text-sm">Certifications: {instructor.certifications.join(", ")}</div>
          </div>
        </div>
        <div className="pt-6">
          <h3 className="text-xl font-bold mb-2">About {instructor.name.split(" ")[0]}</h3>
          <p className="text-gray-700">{instructor.about}</p>
        </div>
        <div className="flex justify-center pt-6">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg shadow transition">Book a Session</button>
        </div>
      </div>
    </div>
  );
}
