'use client';
import axios from "axios";
import {Trash} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function EventTypeDelete({id}:{id:string}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  async function handleDelete() {
    await axios.delete('/api/event-types?id='+id);
    router.push('/dashboard/event-types');
    router.refresh();
  }
  return (
    <div>
      {!showConfirmation && (
        <button
          onClick={() => setShowConfirmation(true)}
          type="button" className="btn-red">
          <Trash size={16}/>
          Delete
        </button>
      )}
      {showConfirmation && (
        <div>
          <button
            onClick={() => setShowConfirmation(false)}
            className="btn-gray">
            Cancel
          </button>
          <button
            onClick={() => handleDelete()}
            className="btn-red">
            Yes, Delete
          </button>
        </div>
      )}
    </div>
  );
}