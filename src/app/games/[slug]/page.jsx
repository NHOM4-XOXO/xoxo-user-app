import React from "react";
import GamePlayer from "../GamePlayer";

export default function Page({ params }) {
  return (
    <>
      <GamePlayer slug={params.slug} />
    </>
  );
}
