import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import Ping from "./Ping";
import { writeClient } from "@/sanity/lib/write-client";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  // Triggering an asynchronous operation after fetching the data
  updateViewCount(id, totalViews);

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};

// Function to handle the view count update in the background
async function updateViewCount(id: string, currentViews: number) {
  try {
    await writeClient
      .patch(id)
      .set({ views: currentViews + 1 })
      .commit();
    console.log(`View count for ${id} updated successfully.`);
  } catch (error) {
    console.error(`Failed to update view count for ${id}:`, error);
  }
}

export default View;
