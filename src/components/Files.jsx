import { For, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api";
import FolderIcon from "../img/folder.svg";
import FileIcon from "../img/file.svg";
import "highlight.js/styles/github.css";
//import "prism-themes/themes/prism-coldark-dark.css";
import "prism-themes/themes/prism-vsc-dark-plus.css";
import Prism from "prismjs";
import { IconX } from "@tabler/icons-solidjs";
import clickOutside from "../functions/clickOutside";

export function Files(props) {
  const [data, setData] = createSignal(false);
  const [fileName, setFileName] = createSignal("");
  const [fileContent, setFileContent] = createSignal("");
  const [openFileContent, setOpenFileContent] = createSignal(false);
  const [pos, setPos] = createSignal({ x: 0, y: 0 });
  const [menu, setMenu] = createSignal(false);
  const [menuPos, setMenuPos] = createSignal({ x: 0, y: 0 });
  const [selected, setSelected] = createSignal("");

  const handlePos = (e) => {
    setPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleContextMenu = (e) => {
    setMenu(true);
    setMenuPos({
      x: pos().x,
      y: pos().y,
    });
  };

  const readFile = async (path) => {
    let res = await invoke("read_file", { path });
    setFileContent(res);
    setOpenFileContent(true);
    let aux = path.split("/").pop();
    console.log("aux", aux);
    setFileName(aux);
    setMenu(false);
  };

  const handleClick = async (folderName) => {
    setOpenFileContent(false);
    await invoke("go_dir", { folderName });
    setData(true);
    props.onDataFromChild(data());
    setData(false);
  };

  return (
    <div
      onMouseMove={handlePos}
      className="overflow-x-scroll overflow-y-scroll mt-5  fixed top-[30px] left-[20%] w-[80%] h-[calc(100%-40px)]"
    >
      {menu() ? (
        <div
          use:clickOutside={() => setMenu(false)}
          className="menu border border-gray-700 bg-zinc-900 -ml-60 absolute w-[150px] h-auto gap-0 flex flex-col rounded-xl overflow-hidden"
          style={{ top: `${menuPos().y}px`, left: `calc(${menuPos().x}px)` }}
        >
          <button
            onClick={() => readFile(selected())}
            className="text-left  h-[40px] text-sm hover:bg-slate-700 transition duration-300"
          >
            <p className="ml-5">Open</p>
          </button>
          <button className="text-left  h-[40px] text-sm hover:bg-slate-700  transition duration-300">
            <p className="ml-5">Change name</p>
          </button>
          <button className="text-left  h-[40px] text-sm font-bold hover:bg-red-600  transition duration-300">
            <p className="ml-5">Delete</p>
          </button>
        </div>
      ) : null}

      {!openFileContent() ? (
        <div
          onContextMenu={(e) => {
            show(e, { props: MENU_ID });
          }}
          className="w-max-content ml-10 overflow-x-auto mt-5 flex flex-col gap-2"
        >
          {props !== undefined || fileContent.data().lenght > 0 ? (
            <For each={props.dirs}>
              {(dir, i) => (
                <button
                  key={i}
                  className="focus:bg-slate-600 w-[95%] flex rounded-md  min-h-[45px] items-center  border-gray-700 border-l-0 border-r-0 border-t-0 transition duration-300 hover:bg-zinc-800"
                >
                  {dir[1] === "File" ? (
                    <div
                      onContextMenu={(e) => {
                        handleContextMenu(e);
                        setSelected(props.title + "/" + dir[0]);
                      }}
                      onClick={() => setSelected(props.title + "/" + dir[0])}
                      onDblClick={() => readFile(props.title + "/" + dir[0])}
                      className="ml-2 w-full folder flex items-center gap-3 text-sm transition duration-300 "
                    >
                      <img src={FileIcon} className="w-[40px] h-[40px]" />
                      <p className="truncate">{dir[0]}</p>
                    </div>
                  ) : (
                    <div
                      onDblClick={() => handleClick(dir[0])}
                      className="ml-2 w-full folder flex items-center gap-3 text-sm transition duration-300"
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
        <div
          use:clickOutside={() => setOpenFileContent(false)}
          className="flex flex-col"
        >
          <div className="fixed flex  w-full h-[27px]  items-center  bg-zinc-900">
            <div className="flex gap-3 items-center justify-center w-auto border border-r-0 border-t-0 border-l-0 border-b-cyan-600 hover:bg-slate-700   ">
              <h1 className="font-bold ml-2 ">{fileName()}</h1>
              <button
                className=" flex items-center justify-center"
                onClick={() => setOpenFileContent(false)}
              >
                <IconX size={15} className="" />
              </button>
            </div>
          </div>

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
