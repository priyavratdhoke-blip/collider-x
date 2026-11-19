# COLLIDER X 2.0 — Interactive Particle Physics Laboratory

A React + Three.js educational particle-physics environment with a Node.js bridge to the CERN Open Data Portal.

## Run on Ubuntu / Linux / macOS / Windows

Requirements: Node.js 18+ and npm.

```bash
unzip COLLIDER-X-2.zip
cd COLLIDER-X-2
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally http://localhost:5173). The Node API bridge runs on http://localhost:8787. Keep both processes running; `npm run dev` starts both.

Production build:

```bash
npm run build
npm run preview

Run the physics unit tests (no browser required):

```bash
npm test
```
```

## Implemented

- Responsive research-lab interface and navigation.
- Three.js cylindrical detector concept with rotatable view, beam axis, event tracks and toggleable subsystem layers.
- Teaching-event generator with synthetic event labelling.
- Event import from JSON and CSV; best-effort `.ig` ZIP/JSON extraction adapter and bundled sample events.
- Kinematic object normalisation from `pt/eta/phi` or Cartesian `px/py/pz`.
- Four-vector construction in natural units (c = 1), event sums, invariant mass and vector-sum transverse momentum.
- Selectable-object combination analysis.
- Standard Model reference catalogue.
- CERN Open Data REST API search and record metadata inspection through a local server-side proxy.
- Provenance labels and explicit scientific limitations.

## Data formats and limitations

CERN Open Data contains multiple levels and experiment-specific formats. CMS AOD/MiniAOD/NanoAOD ROOT files are not decoded by this browser application. The `.ig` importer is a best-effort ZIP/JSON adapter: it looks for a JSON member and normalises simple particle-object arrays. CERN iSpy `.ig` files can contain a richer experiment-specific structure; files that do not expose the supported object schema will be rejected rather than silently misrepresented. For the official complete CMS event display, use https://opendata.cern/visualise/events/cms.

Imported event visualization uses the imported objects' kinematics to draw a projection. It does not reconstruct detector hits, tracks, clusters, jets, vertices or particle identification from raw detector signals. Detector cylinders are conceptual and not to scale. The accelerator controls are explanatory UI settings only; they do not simulate LHC beam dynamics or control hardware. The synthetic event generator is not a Monte Carlo physics generator such as Pythia and its output is not research-grade collision data.

The four-vector calculations assume the supplied `pt`, `eta`, `phi`, and mass values are physically meaningful and expressed in GeV, dimensionless pseudorapidity, and radians. The app cannot infer missing metadata or validate a dataset's physics selection. Check the source record and its DOI before citing or analysing imported data.

## CERN integration

The backend calls the public CERN Open Data Portal REST API at `https://opendata.cern.ch/api/records/`. The proxy avoids relying on browser-side cross-origin access. CERN catalogue search returns metadata; it does not automatically download or decode large ROOT/AOD files.

## References

- https://opendata.cern.ch/docs/about-cms
- https://opendata.cern.ch/docs/cms-guide-for-research
- https://cms.cern/content/analysis-tools-and-cms-public-data-formats
- https://opendata.cern.ch/visualise/events/cms

COLLIDER X is an independent educational project and is not an official CERN product.
