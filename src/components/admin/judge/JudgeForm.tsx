// import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2 } from "lucide-react";
// import { Judge, NewJudge } from '@/types/judge';

// interface JudgeFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (judge: NewJudge | Partial<Judge>) => Promise<boolean>;
//   editingJudge: Judge | null;
//   isSubmitting: boolean;
// }

// const JudgeForm: React.FC<JudgeFormProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   editingJudge,
//   isSubmitting
// }) => {
//   const [formData, setFormData] = React.useState<NewJudge | Partial<Judge>>(
//     editingJudge || {
//       email: "",
//       password: "",
//       password_confirmation: "",
//       profile: {
//         first_name: "",
//         last_name: "",
//         cid_no: "",
//         phone_number: ""
//       },
//       court_id: ""
//     }
//   );

//   React.useEffect(() => {
//     if (editingJudge) {
//       setFormData(editingJudge);
//     } else {
//       setFormData({
//         email: "",
//         password: "",
//         password_confirmation: "",
//         profile: {
//           first_name: "",
//           last_name: "",
//           cid_no: "",
//           phone_number: ""
//         },
//         court_id: ""
//       });
//     }
//   }, [editingJudge]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const success = await onSubmit(formData);
//     if (success) {
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>
//             {editingJudge ? "Edit Judge" : "Create New Judge"}
//           </DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="email" className="text-right">
//                 Email*
//               </label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                 className="col-span-3"
//                 placeholder="Enter email"
//                 required
//               />
//             </div>
            
//             {!editingJudge && (
//               <>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <label htmlFor="password" className="text-right">
//                     Password*
//                   </label>
//                   <Input
//                     id="password"
//                     name="password"
//                     type="password"
//                     value={(formData as NewJudge).password}
//                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                     className="col-span-3"
//                     placeholder="Enter password"
//                     required
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <label htmlFor="password_confirmation" className="text-right">
//                     Confirm Password*
//                   </label>
//                   <Input
//                     id="password_confirmation"
//                     name="password_confirmation"
//                     type="password"
//                     value={(formData as NewJudge).password_confirmation}
//                     onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
//                     className="col-span-3"
//                     placeholder="Confirm password"
//                     required
//                   />
//                 </div>
//               </>
//             )}
            
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="first_name" className="text-right">
//                 First Name*
//               </label>
//               <Input
//                 id="first_name"
//                 name="first_name"
//                 value={formData.profile?.first_name}
//                 onChange={(e) => setFormData({
//                   ...formData,
//                   profile: {...formData.profile, first_name: e.target.value}
//                 })}
//                 className="col-span-3"
//                 placeholder="Enter first name"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="last_name" className="text-right">
//                 Last Name
//               </label>
//               <Input
//                 id="last_name"
//                 name="last_name"
//                 value={formData.profile?.last_name}
//                 onChange={(e) => setFormData({
//                   ...formData,
//                   profile: {...formData.profile, last_name: e.target.value}
//                 })}
//                 className="col-span-3"
//                 placeholder="Enter last name"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="cid_no" className="text-right">
//                 CID Number
//               </label>
//               <Input
//                 id="cid_no"
//                 name="cid_no"
//                 value={formData.profile?.cid_no}
//                 onChange={(e) => setFormData({
//                   ...formData,
//                   profile: {...formData.profile, cid_no: e.target.value}
//                 })}
//                 className="col-span-3"
//                 placeholder="Enter CID number"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="phone_number" className="text-right">
//                 Phone Number
//               </label>
//               <Input
//                 id="phone_number"
//                 name="phone_number"
//                 value={formData.profile?.phone_number}
//                 onChange={(e) => setFormData({
//                   ...formData,
//                   profile: {...formData.profile, phone_number: e.target.value}
//                 })}
//                 className="col-span-3"
//                 placeholder="Enter phone number"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <label htmlFor="court_id" className="text-right">
//                 Court ID*
//               </label>
//               <Input
//                 id="court_id"
//                 name="court_id"
//                 value={editingJudge ? editingJudge.court.id.toString() : (formData as NewJudge).court_id}
//                 onChange={(e) => editingJudge 
//                   ? setFormData({
//                       ...formData,
//                       court: {...formData.court, id: parseInt(e.target.value) || 0}
//                     })
//                   : setFormData({
//                       ...formData,
//                       court_id: e.target.value
//                     })
//                 }
//                 className="col-span-3"
//                 placeholder="Enter court ID"
//                 required
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button 
//               type="button"
//               variant="outline" 
//               onClick={onClose}
//             >
//               Cancel
//             </Button>
//             <Button 
//               type="submit"
//               disabled={isSubmitting}
//             >
//               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {editingJudge ? "Save Changes" : "Create Judge"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default JudgeForm;