import { For, createSignal, onMount } from "solid-js";
import { IconArrowRight } from "@tabler/icons-solidjs";
import { IconArrowLeft } from "@tabler/icons-solidjs";
import { Breadcrumbs, Link } from "@suid/material";
import { buttonBaseClasses } from "@suid/material/ButtonBase";
import { IconSearch } from "@tabler/icons-solidjs";
import { IconMenu2 } from "@tabler/icons-solidjs";

export default function Navbar(props) {
  return (
    <div className="border border-slate-700 inset-0 fixed w-full h-[30px] flex items-center gap-3">
      <div className="navigation flex gap-3 ml-3">
        <button>
          <IconArrowLeft />
        </button>
        <button>
          <IconArrowRight />
        </button>
      </div>
      <Breadcrumbs className="text-white text-sm z-10" aria-label="breadcrumb">
        <For each={props.title.split("/")}>
          {(t, i) => <button className="hover:underline">{t}</button>}
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
