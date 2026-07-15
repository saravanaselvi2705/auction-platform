import { useEffect } from "react";

export default function PageTitle({ title }) {
  useEffect(() => {
    document.title = title ? `${title} | AuctionHub` : "AuctionHub";
  }, [title]);

  return null;
}
