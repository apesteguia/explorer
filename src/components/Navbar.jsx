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

  const handleClick = (folderName) => {
    invoke("go_dir", { folderName });
    setData(true);
    props.onDataFromChild(data());
    setData(false);
  };

  const handleBack = async () => {
    await invoke("go_back");
    setBack(true);
    props.onClickBack(back());
    setBack(false);
  };

  return (
    <div className="border border-slate-700 inset-0 fixed w-full h-[30px] flex items-center gap-3">
      <div className="navigation flex gap-3 ml-3">
        <button onClick={handleBack}>
          <IconArrowLeft />
        </button>
        <button>
          <IconArrowRight />
        </button>
      </div>
      <Breadcrumbs className="text-white text-sm z-10" aria-label="breadcrumb">
        <For each={props.title.split("/")}>
          {(t, i) => (
            <button
              onClick={() => {
                const folderPath = props.title
                  .split("/")
                  .slice(0, i() + 1)
                  .join("/");
                handleClick(folderPath);
              }}
              className="hover:underline"
            >
              {t}
            </button>
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
