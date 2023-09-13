import FolderIcon from "../img/folder.svg";
import { IconHome } from "@tabler/icons-solidjs";
import { IconMenu2 } from "@tabler/icons-solidjs";
import { IconFiles } from "@tabler/icons-solidjs";
import { IconTrash } from "@tabler/icons-solidjs";
import { IconVideo } from "@tabler/icons-solidjs";
import { IconCamera } from "@tabler/icons-solidjs";
import { IconDownload } from "@tabler/icons-solidjs";
import { IconMusic } from "@tabler/icons-solidjs";
import { invoke } from "@tauri-apps/api";

export default function Sidebar({ props }) {
  const handleClick = (folderName) => {
    invoke("go_dir", { folderName });
  };

  return (
    <div className="bg-zinc-800 fixed min-w-[20%]  h-full flex-col justify-center">
      <div className="header h-[40px] flex justify-center-center gap-2">
        <div
          onClick={() => handleClick("/home")}
          className="flex  w-full items-center  h-[40px]  transition duration-300"
        >
          <p className="ml-10 font-bold">Places</p>
        </div>
        <button className=" flex items-center justify-center mr-4">
          <IconMenu2 />
        </button>
      </div>
      <div className=" flex flex-col items-center h-[90%]">
        <button className="hover:bg-zinc-700 gap-3 transition flex items-center duration-300 h-[40px]  w-[90%] text-left rounded-md">
          <p className="flex ml-1  items-center justify-center">
            <IconHome size={20} />
          </p>
          <p className="mt-1">Home</p>
        </button>
        <button className="hover:bg-zinc-700 gap-3 transition flex items-center duration-300 h-[40px]  w-[90%] text-left rounded-md">
          <p className="flex ml-1  items-center justify-center">
            <IconFiles size={20} />
          </p>
          <p className="mt-1">Documents</p>
        </button>
        <button className="hover:bg-zinc-700 gap-3 transition flex items-center duration-300 h-[40px]  w-[90%] text-left rounded-md">
          <p className="flex ml-1  items-center justify-center">
            <IconDownload size={20} />
          </p>
          <p className="mt-1">Downloads</p>
        </button>
        <button className="hover:bg-zinc-700 gap-3 transition flex items-center duration-300 h-[40px]  w-[90%] text-left rounded-md">
          <p className="flex ml-1  items-center justify-center">
            <IconMusic size={20} />
          </p>
          <p className="mt-1">Music</p>
        </button>
        <button className="hover:bg-zinc-700 gap-3 transition flex items-center duration-300 h-[40px]  w-[90%] text-left rounded-md">
          <p className="flex ml-1  items-center justify-center">
            <IconCamera size={20} />
          </p>
          <p className="mt-1">Pictures</p>
        </button>
        <button className="hover:bg-zinc-700 gap-3 transition flex items-center duration-300 h-[40px]  w-[90%] text-left rounded-md">
          <p className="flex ml-1  items-center justify-center">
            <IconVideo size={20} />
          </p>
          <p className="mt-1">Videos</p>
        </button>
        <button className="hover:bg-zinc-700 gap-3 transition flex items-center duration-300 h-[40px]  w-[90%] text-left rounded-md">
          <p className="flex ml-1  items-center justify-center">
            <IconTrash size={20} />
          </p>
          <p className="mt-1">Trash</p>
        </button>
      </div>
    </div>
  );
}
