import FolderIcon from "../img/folder.svg";
import { IconHome } from "@tabler/icons-solidjs";

export default function Sidebar() {
  return (
    <div className="border border-slate-700 fixed min-w-[25%] top-[30px] h-[calc(100%-30px)] flex flex-col items-left">
      <button className="flex gap-3 w-full items-center  h-[40px] hover:bg-slate-700">
        <img src={FolderIcon} className="ml-3 w-[30px] h-[30px]" alt="" />
        <p>Home</p>
      </button>
    </div>
  );
}
