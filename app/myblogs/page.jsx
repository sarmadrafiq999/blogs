// "use client"

// import { useAuth  } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Card, CardContent } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { Badge } from "../../components/ui/badge";
// import { Loader2, Eye } from "lucide-react";

// export default function MyBlogsPage() {
//   const { userId } = useAuth();
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const res = await fetch("/api/myblogs");
//         const data = await res.json();
//         setBlogs(data.blogs || []);
//       } catch (err) {
//         console.error("Error fetching my blogs:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[60vh]">
//         <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <h1 className="text-4xl font-bold text-center mb-8 text-purple-700">
//         My Blogs
//       </h1>

//       {blogs.length === 0 ? (
//         <p className="text-center text-gray-600 text-lg">
//           You haven’t written any blogs yet.
//         </p>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-6">
//           {blogs.map((blog) => (
//             <Card
//               key={blog._id}
//               className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-purple-400 transition-shadow duration-300"
//             >
//               {blog.images?.[0] && (
//                 <img
//                   src={blog.images[0]}
//                   alt={blog.title}
//                   className="w-full h-48 object-cover"
//                 />
//               )}
//               <CardContent className="p-4 space-y-3">
//                 <h2 className="text-2xl font-semibold text-purple-700">
//                   {blog.title}
//                 </h2>
//                 <p className="text-gray-700 text-sm line-clamp-3">
//                   {blog.content.replace(/[#*_!\[\]\(\)]/g, "").slice(0, 120)}...
//                 </p>
//                 <div className="flex justify-between items-center mt-4">
//                   <Badge variant="outline" className="text-xs">
//                     Posted: {new Date(blog.createdAt).toLocaleDateString()}
//                   </Badge>
//                   <Link href={`/bloglist/${blog._id}`}>
//                     <Button variant="outline" className="flex items-center gap-1 text-purple-600">
//                       <Eye className="w-4 h-4" /> View
//                     </Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
