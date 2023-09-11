import { For } from "solid-js";
import { IconFolderFilled } from "@tabler/icons-solidjs";
import { IconFile } from "@tabler/icons-solidjs";

export function Files(props) {
  return (
    <div className="border border-slate-700  absolute top-[30px] left-[25%] w-[75%] h-[calc(100%-30px)]">
      {props.dirs !== undefined ? (
        <For each={props.dirs}>
          {(dir, i) => (
            <button className="flex w-full h-[40px] items-center border transition duration-300 ease-in-out hover:bg-slate-800">
              {dir.includes("File") ? (
                <div className="folder flex  items-center gap-3 text-xl">
                  <IconFile />
                  <p>{dir}</p>
                </div>
              ) : (
                <div className="folder flex  items-center gap-3 text-xl">
                  <IconFolderFilled />
                  <p>{dir}</p>
                </div>
              )}
            </button>
          )}
        </For>
      ) : (
        <p>Loading..</p>
      )}
    </div>
  );
}
