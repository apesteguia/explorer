import { For, createSignal, onMount } from "solid-js";
import { IconArrowRight } from "@tabler/icons-solidjs";
import { IconArrowLeft } from "@tabler/icons-solidjs";
import { Breadcrumbs, Link } from "@suid/material";
import { IconSearch } from "@tabler/icons-solidjs";
import { invoke } from "@tauri-apps/api";
import clickOutside from "../functions/clickOutside";
import { IconX } from "@tabler/icons-solidjs";
import { IconDotsVertical } from "@tabler/icons-solidjs";

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
    <div className="  inset-0 fixed left-[20%] w-[80%] h-[40px] flex items-center gap-3">
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
        <div className=" w-[80%] rounded-md bg-zinc-800 gap-3 flex items-center">
          <div
            className="text-white w-[90%]  text-sm z-10 overflow-hidden items-center flex h-[30px]"
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
                  <button className=" rounded-lg transition duration-300 flex gap-2 p-1 ">
                    <p className="hover:underline truncate break-words">{t}</p>{" "}
                    <p>/</p>
                  </button>
                </div>
              )}
            </For>
          </div>
          <button onClick={() => setToggleSearch(true)} className="">
            <IconSearch size={20} className="" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleForm}
          className=" w-[80%] rounded-md bg-zinc-800  flex items-center h-[30px] focus:bg-zinc-700"
          use:clickOutside={setToggleSearch(false)}
        >
          <IconSearch
            className="ml-1 indent-3 rounded-full flex items-center justify-center p-1 "
            size={26}
          />
          <input
            onChange={handleSearch}
            type="text"
            value={props.title}
            className="bg-zinc-800 indent-3 rounded-sm transition duration-300  w-full outline-none text-white text-sm "
          />
          <button className="mr-2">
            <IconX />
          </button>
        </form>
      )}
      <div>
        <button className="flex items-center justify-center mr-2">
          <IconDotsVertical />
        </button>
      </div>
    </div>
  );
}
