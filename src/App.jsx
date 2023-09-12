import { For, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@suid/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Files } from "./components/Files";

export default function BasicAppBar() {
  const [dirs, setDirs] = createSignal([]);
  const [title, setTitle] = createSignal("");
  const [history, setHistory] = createSignal([]);

  const displayDirs = async () => {
    const res = await invoke("display_dirs");
    setDirs(res);
  };

  const getTitle = async () => {
    const res = await invoke("get_dir_string");
    setTitle(res);
  };

  const handleRefresh = (data) => {
    console.log("HOla", data);
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
    <div className="absolute inset-0 flex w-full min-h-full h-auto bg-slate-950 text-white">
      <Navbar
        onDataFromChild={handleRefresh}
        onClickBack={handleRefresh}
        title={title()}
      />
      <Sidebar />
      <Files onDataFromChild={handleRefresh} dirs={dirs()} />
      <div className="-z-10 cubrir  inset-0 border-slate-700 border"></div>
    </div>
  );
}
