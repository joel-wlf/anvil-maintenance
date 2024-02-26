import PocketBase from "pocketbase";

const backendUrl: string = localStorage.getItem("backendUrl") || "";

const pb: PocketBase = new PocketBase(backendUrl);

export default pb;
