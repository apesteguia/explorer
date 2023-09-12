import { For, createSignal, onMount } from "solid-js";
import { IconArrowRight } from "@tabler/icons-solidjs";
import { IconArrowLeft } from "@tabler/icons-solidjs";
import { Breadcrumbs, Link } from "@suid/material";
import { IconSearch } from "@tabler/icons-solidjs";
import { IconMenu2 } from "@tabler/icons-solidjs";
import { invoke } from "@tauri-apps/api";
import clickOutside from "../functions/clickOutside";

export default function Navbar(props) {
  const [search, setSearch] = createSignal("");
  const [toggleSearch, setToggleSearch] = createSignal(false);
  const [data, setData] = createSignal(false);
  const [history, setHistory] = createSignal([]);

  const handleClickFolder = (index) => {
    const folderPath = props.title
      .split("/")
      .slice(0, index + 1)
      .join("/");
    handleClick(folderPath);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleForm = (e) => {
    e.preventDefault();
    setToggleSearch(false);
    let folderName = search();
    invoke("go_dir", { folderName });
    props.onDataFromChild(true);
    aux.push(folderName);
    setHistory(aux);
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
    <div className="border  border-gray-700 inset-0 fixed w-full h-[30px] flex items-center gap-3">
      <div className="navigation flex gap-3 ml-3">
        <button
          className="rounded-full flex items-center justify-center hover:bg-gray-700 transition duration-300 "
          onClick={handleBack}
        >
          <IconArrowLeft />
        </button>
        <button
          className="rounded-full flex items-center justify-center hover:bg-gray-700 transition duration-300 "
          onClick={handleFront}
        >
          <IconArrowRight />
        </button>
      </div>

      {!toggleSearch() ? (
        <div>
          <Breadcrumbs
            className="text-white text-sm z-10"
            aria-label="breadcrumb"
          >
            <For each={props.title.split("/")}>
              {(t, i) => (
                <div
                  key={i}
                  onClick={() => {
                    handleClickFolder(i());
                  }}
                  className=""
                >
                  <button className="hover:underline rounded-lg transition duration-300 hover:bg-zinc-600 bg-zinc-700 pl-2 pr-2">
                    {t}
                  </button>
                </div>
              )}
            </For>
          </Breadcrumbs>
          <button
            onClick={() => setToggleSearch(true)}
            className="absolute -mt-5 right-14"
          >
            <IconSearch size={20} className="" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleForm}
          className="border   border-zinc-600  flex w-[90%] bg-zinc-800 overflow-hidden rounded-md focus:bg-zinc-700"
          use:clickOutside={setToggleSearch(false)}
        >
          <IconSearch
            className="bg-zinc-700 indent-3 rounded-full flex items-center justify-center p-1 "
            size={20}
          />
          <input
            onChange={handleSearch}
            type="text"
            value={props.title}
            className="bg-zinc-800 indent-3 rounded-sm transition duration-300  w-full outline-none text-white text-sm "
          />
        </form>
      )}

      <button className="absolute right-5">
        <IconMenu2 size={20} className="" />
      </button>
    </div>
  );
}
