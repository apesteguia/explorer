import { For, createSignal } from "solid-js";
import { IconFolderFilled } from "@tabler/icons-solidjs";
import { IconFile } from "@tabler/icons-solidjs";
import { invoke } from "@tauri-apps/api";

export function Files(props) {
  const [data, setData] = createSignal(false);

  const handleClick = async (folderName) => {
    await invoke("go_dir", { folderName });
    setData(true);
    props.onDataFromChild(data());
    setData(false);
  };

  return (
    <div className="overflow-hidden overflow-x-auto overflow-y-scroll border border-slate-700 absolute top-[30px] left-[25%] w-[75%] h-[calc(100%-30px)]">
      <div className="w-max-content">
        {props !== undefined > 0 ? (
          <For each={props.dirs}>
            {(dir, i) => (
              <button
                key={i}
                className=" flex  w-screen min-h-[40px] items-center border border-slate-700 border-l-0 border-r-0 border-t-0 transition duration-300 ease-in-out hover:bg-slate-800"
              >
                {dir[1] === "File" ? (
                  <div className="ml-4 w-full folder flex items-center gap-3 text-xl">
                    <IconFile />
                    <p className="truncate">{dir[0]}</p>
                  </div>
                ) : (
                  <div
                    onClick={() => handleClick(dir[0])}
                    className="ml-4 w-full folder flex items-center gap-3 text-xl"
                  >
                    <IconFolderFilled />
                    <p className="truncate">{dir[0]}</p>
                  </div>
                )}
              </button>
            )}
          </For>
        ) : (
          <p>Loading..</p>
        )}
      </div>
    </div>
  );
}
