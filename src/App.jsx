import { For, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@suid/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Files } from "./components/Files";

export default function BasicAppBar() {
  const [dirs, setDirs] = createSignal([]);
  const [title, setTitle] = createSignal("");
  const [text, handleText] = createSignal("");

  document.addEventListener("contextmenu", (e) => {
    //e.preventDefault();
  });

  const displayDirs = async () => {
    const res = await invoke("display_dirs");
    setDirs(res);
  };

  const getTitle = async () => {
    const res = await invoke("get_dir_string");
    setTitle(res);
  };

  const handleRefresh = (data) => {
    if (data) {
      displayDirs();
      getTitle();
    }
  };

  onMount(async () => {
    await getTitle();
    await displayDirs();
  });

  return (
    <div className="fixed inset-0 flex min-h-screen  w-full  h-auto bg-zinc-900 text-white">
      <Navbar
        onDataFromChild={handleRefresh}
        onClickBack={handleRefresh}
        title={title()}
      />
      <Sidebar />
      {dirs().length > 0 ? (
        <Files onDataFromChild={handleRefresh} title={title()} dirs={dirs()} />
      ) : (
        <p className="absolute inset-2/4 w-full -mt-5 ml-5">Empty directory</p>
      )}
      <div className="-z-10 cubrir  inset-0 border-gray-700700 border"></div>
    </div>
  );
}
