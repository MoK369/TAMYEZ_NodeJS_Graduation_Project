import mongoose from "mongoose";
import StringConstants from "../utils/constants/strings.constants.ts";

async function connnectToDB(): Promise<boolean> {
  try {
    await mongoose.connect(process.env.DB_URI!);
    console.log(mongoose.connection.models);
    console.log(StringConstants.CONNECTED_TO_DB_MESSAGE);
    await startCollectionWatcher();
    return true;
  } catch (e) {
    console.log(StringConstants.FAILED_CONNECTED_TO_DB_MESSAGE, e);
    return false;
  }
}

async function startCollectionWatcher() {
  await ensurePreImagesEnabled("users");
  const usersStream = mongoose.connection.db?.collection("users").watch([], {
    fullDocument: "updateLookup",
    fullDocumentBeforeChange: "required",
  });

  usersStream?.on("change", async (change) => {
    console.log({ change });
  });
}

async function ensurePreImagesEnabled(collectionName: string) {
  if (!mongoose.connection.db) return;
  try {
    await mongoose.connection.db.command({
      collMod: collectionName,
      changeStreamPreAndPostImages: { enabled: true },
    });
  } catch (err: any) {
    // NamespaceNotFound (code 26) => collection does not exist
    if (err?.code === 26 || /NamespaceNotFound/i.test(err?.errmsg || "")) {
      // Create the collection with the desired option
      await mongoose.connection.db.createCollection(collectionName, {
        changeStreamPreAndPostImages: { enabled: true },
      });
    }
  }
}

export default connnectToDB;
