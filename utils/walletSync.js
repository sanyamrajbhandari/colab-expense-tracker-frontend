import api from "./api";

/**
 * Fetches all wallets, finds external ones, and triggers a sync for each.
 * Returns the total number of new transactions synced.
 */
export const syncAllExternalWallets = async () => {
  try {
    const walletsRes = await api.get("/wallets");
    const wallets = Array.isArray(walletsRes.data?.data) ? walletsRes.data.data : [];
    const externalWallets = wallets.filter(w => w.isExternal);

    if (externalWallets.length === 0) return 0;

    const syncPromises = externalWallets.map(w => 
      api.post(`/wallets/${w._id}/sync`).catch(err => {
        console.error(`Failed to sync wallet ${w.name}:`, err);
        return { data: { data: { syncedCount: 0 } } };
      })
    );

    const results = await Promise.all(syncPromises);
    const totalSynced = results.reduce((acc, res) => acc + (res.data?.data?.syncedCount || 0), 0);
    
    return totalSynced;
  } catch (error) {
    console.error("Error during external wallet synchronization:", error);
    return 0;
  }
};
