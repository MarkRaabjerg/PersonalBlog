import PocketBase from "pocketbase";

const url =
  process.env.NEXT_PUBLIC_POCKETBASE_URL ||
  "https://pb.markraabjerg.blog";

console.log("Creating PocketBase with:", url);

export const pb = new PocketBase(url);

console.log("PocketBase created successfully");