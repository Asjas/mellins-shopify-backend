import { atlasDb } from "../db/atlas";

type Customer = {
  cmf_id?: string;
  cmf_pat_id?: string;
};

async function getCustomerFromAtlasDb(idNumber: string): Promise<boolean> {
  try {
    const db = atlasDb();
    const [customerFound]: [Customer] = await db("SELECT cmf_id, cmf_pat_id FROM cmf WHERE cmf_id = ?", [idNumber]);

    if (customerFound?.cmf_id || customerFound?.cmf_pat_id) {
      return true;
    }

    return false;
  } catch (err) {
    console.error(err);
  }

  return false;
}

export default getCustomerFromAtlasDb;
