import { For, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api";
import FolderIcon from "../img/folder.svg";
import FileIcon from "../img/file.svg";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github.css";
import "prism-themes/themes/prism-coldark-dark.css";
import Prism from "prismjs";
import { IconX } from "@tabler/icons-solidjs";

export function Files(props) {
  const [data, setData] = createSignal(false);
  const [fileName, setFileName] = createSignal("");
  const [fileContent, setFileContent] = createSignal("");
  const [openFileContent, setOpenFileContent] = createSignal(false);

  const readFile = async (path) => {
    let res = await invoke("read_file", { path });
    setFileContent(res);
    setOpenFileContent(true);
    let aux = path.split("/").pop();
    console.log("aux", aux);
    setFileName(aux);
  };

  const handleClick = async (folderName) => {
    setOpenFileContent(false);
    await invoke("go_dir", { folderName });
    setData(true);
    props.onDataFromChild(data());
    setData(false);
  };

  return (
    <div className="overflow-hidden overflow-x-auto overflow-y-scroll border border-slate-700 absolute top-[30px] left-[25%] w-[75%] h-[calc(100%-30px)]">
      {!openFileContent() ? (
        <div className="w-max-content flex flex-col gap-2">
          {props !== undefined || fileContent.data().lenght > 0 ? (
            <For each={props.dirs}>
              {(dir, i) => (
                <button
                  key={i}
                  className=" flex  w-screen min-h-[45px] items-center  border-slate-700 border-l-0 border-r-0 border-t-0 transition duration-300 ease-in-out hover:bg-slate-800"
                >
                  {dir[1] === "File" ? (
                    <div
                      onDblClick={() => readFile(props.title + "/" + dir[0])}
                      className="ml-2 w-full folder flex items-center gap-3 text-sm"
                    >
                      <img src={FileIcon} className="w-[40px] h-[40px]" />
                      <p className="truncate">{dir[0]}</p>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleClick(dir[0])}
                      className="ml-2 w-full folder flex items-center gap-3 text-sm"
                    >
                      <img src={FolderIcon} className="w-[40px] h-[40px]" />
                      <p className="truncate">{dir[0]}</p>
                    </div>
                  )}
                </button>
              )}
            </For>
          ) : (
            <p>hola</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="fixed w-full h-[27px]  justify-center  bg-slate-950">
            <h1 className="font-bold ml-2 mt-1">{fileName()}</h1>
          </div>
          <button
            className="fixed right-5 mt-5"
            onClick={() => setOpenFileContent(false)}
          >
            <IconX />
          </button>
          <pre className="ml-5 text-sm mt-10">
            <code
              className={`language-${props.language || "markup"}`}
              ref={(codeRef) => {
                if (codeRef) {
                  codeRef.innerHTML = Prism.highlight(
                    fileContent(),
                    Prism.languages["javascript" || "markup"],
                    "javascript" || "markup"
                  );
                }
              }}
            ></code>
          </pre>
        </div>
      )}
    </div>
  );
}
