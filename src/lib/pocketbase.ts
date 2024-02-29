import PocketBase from "pocketbase";

const backendUrl: string = localStorage.getItem("backendUrl") || "";

const pb: PocketBase = new PocketBase(backendUrl);

function initializePb(url: string | null) {
  let pb: PocketBase = new PocketBase(<string | undefined>url);
  return pb;
}

export { pb, initializePb };
