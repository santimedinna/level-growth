import dynamic from "next/dynamic";

const MetodoLevelGrowth = dynamic(() =>
  import("@/components/sections/MetodoLevelGrowth").then(m => ({ default: m.MetodoLevelGrowth }))
);

export default function SandboxMetodo() {
  return <MetodoLevelGrowth />;
}
