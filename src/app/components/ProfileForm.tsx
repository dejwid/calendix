'use client';
import axios from "axios";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";

export default function ProfileForm({
  existingUsername = ''
}:{
  existingUsername?:string
}) {
  const [username, setUsername] = useState(existingUsername);
  const [isSaved, setIsSaved] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setIsSaved(false);
    setIsError(false);
    const response = await axios.put('/api/profile', {username});
    if (response.data) {
      setIsSaved(true);
      if (!existingUsername && username) {
        router.push('/dashboard/event-types');
        router.refresh();
      }
    } else {
      setIsError(true);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xs mx-auto mt-8">
      {isSaved && (
        <p>Settings saved!</p>
      )}
      {isError && (
        <p>Error</p>
      )}
      <label>
        <span>Username</span>
        <input
          type="text" value={username}
          onChange={ev => setUsername(ev.target.value)}
        />
        <div className="text-center mt-4">
          <button type="submit" className="btn-blue !px-8">
            Save
          </button>
        </div>
      </label>
    </form>
  );
}