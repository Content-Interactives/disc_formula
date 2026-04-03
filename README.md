# disc_formula (WIP)

Experimental **React + TypeScript** UI for exploring solids of revolution / disc-method ideas: a collapsible **formula bar** (`Formula.tsx`) drives bounds and a string function, and **`Plot3D`** renders the 3D plot with optional rotation. Supporting modules include `VolumeFill`, `Axis`, `RotateX`, and math helpers under `components/utils/`.

Marketing copy, Common Core list, and CK-12 placement placeholders were moved to [`Standards.md`](Standards.md) (note: that file still uses the **“DiscMethod-2 Interactive”** title from the prior README—rename or edit if this fork is tracked separately).

---

## Repository layout (current)

| Path | Role |
|------|------|
| `main.tsx` | `createRoot`, mounts `App.tsx` |
| `App.tsx` | `showBottomTab`, `userFunction`, bounds, `isRotating`; wires `Formula` + `Plot3D` |
| `components/user_inputs/Formula.tsx` | User function + interval inputs |
| `components/3d/Plot3D.tsx` | Main WebGL/3D visualization entry |
| `components/3d/VolumeFill.tsx`, `Axis.tsx`, `RotateX.tsx` | Scene pieces |
| `components/utils/mathUtils.ts`, `colors.ts` | Numerics / styling helpers |
| `index.css`, `App.css` | Global and app styles |
| `types/custom.d.ts` | TS declarations |

There is **no `package.json` / `index.html`** in this working tree snapshot—treat as an incomplete Vite (or similar) project until those files are restored so `npm run dev` works.

---

## Intended stack (from prior developer notes)

React, Vite, TypeScript, Tailwind CSS, GitHub Pages—confirm against a complete checkout.
