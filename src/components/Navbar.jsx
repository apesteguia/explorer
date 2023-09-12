import { For, createSignal, onMount } from "solid-js";
import { IconArrowRight } from "@tabler/icons-solidjs";
import { IconArrowLeft } from "@tabler/icons-solidjs";
import { Breadcrumbs, Link } from "@suid/material";
import { IconSearch } from "@tabler/icons-solidjs";
import { IconMenu2 } from "@tabler/icons-solidjs";
import { invoke } from "@tauri-apps/api";

export default function Navbar(props) {
  const [back, setBack] = createSignal(false);
  const [data, setData] = createSignal(false);
  const [history, setHistory] = createSignal([]);

  const handleClickFolder = (index) => {
    const folderPath = props.title
      .split("/")
      .slice(0, index + 1)
      .join("/");
    handleClick(folderPath);
  };

  const handleClick = (folderName) => {
    let aux = history();
    invoke("go_dir", { folderName });
    setData(true);
    props.onDataFromChild(data());
    setData(false);
    aux.push(folderName);
    setHistory(aux);
  };

  const handleFront = () => {
    let folderName = history()[0],
      aux = history();
    invoke("go_dir", { folderName });
    props.onDataFromChild(true);
    aux.shift();
    if (history() !== undefined) setHistory(aux);
  };

  const handleBack = () => {
    console.log("d", history());
    let aux = history();
    invoke("go_back");
    if (aux !== undefined) {
      aux.unshift(props.title);
      setHistory(aux);
    }
    console.log(history());
    props.onClickBack(true);
  };

  return (
    <div className="border border-slate-700 inset-0 fixed w-full h-[30px] flex items-center gap-3">
      <div className="navigation flex gap-3 ml-3">
        <button onClick={handleBack}>
          <IconArrowLeft />
        </button>
        <button onClick={handleFront}>
          <IconArrowRight />
        </button>
      </div>
      <Breadcrumbs className="text-white text-sm z-10" aria-label="breadcrumb">
        <For each={props.title.split("/")}>
          {(t, i) => (
            <div
              key={i}
              onClick={() => {
                handleClickFolder(i());
              }}
              className="hover:underline "
            >
              <button>{t}</button>
            </div>
          )}
        </For>
      </Breadcrumbs>

      <button className="absolute right-14">
        <IconSearch size={20} className="" />
      </button>

      <button className="absolute right-5">
        <IconMenu2 size={20} className="" />
      </button>
    </div>
  );
}
