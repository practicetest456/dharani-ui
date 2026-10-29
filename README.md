# Dharani UI

React + Vite + TypeScript front end for the Dharani Spring Boot API.

## Start
    npm install
    npm run dev:mock     # sample data, no backend needed  ->  http://localhost:5173
    npm run dev          # real backend: run Spring Boot on :8080 first; /api is proxied

## Where things are
    src/config/modules.ts   dashboard and Information Modules tiles
    src/api/client.ts       every backend call (and the mock data)
    src/components/         LocationSelect, KhataMultiSelect, PdfPanel, ...
    src/pages/              one file per screen
    src/styles.css          theme colours and layout

## Add a new screen
1. Create `src/pages/MyPage.tsx` (copy `Ror1b.tsx` as a starting point).
2. Add `<Route path="/info/my-page" element={<MyPage />} />` in `src/App.tsx`.
3. Set `to: '/info/my-page'` on its tile in `src/config/modules.ts`.
4. Add the backend call to `src/api/client.ts`.

## Backend endpoints used
    Dropdowns   GET  /api/bhu_bharati/mandal/json?districtId=
                GET  /api/bhu_bharati/village/json?mandalId=
                GET  /api/bhu_bharati/surveyNo/json?villageId=
                GET  /api/bhu_bharati/khata-numbers/single?surveyNo=&villageId=
                GET  /api/bhu_bharati/survey_khataNo/json?villageId=   (slow, ROR-1B khata list)
    Land Search POST /api/public-data/view   {villageId, searchData(survey no), district, mandal, khataNoIdselect}
    RoR1B       GET  /api/ror1b/optimized-pdf/generate/pdf?districtId=&mandalId=&villageId=&khataNumbers=
Districts are a static list in `src/config/districts.ts` (the backend has no districts endpoint).

## Backend to-do (before using the real API)
- `PublicDataService.fetch()` sends `searchData` unchanged. The portal expects the survey number encrypted
  (see `BhubharatiSurveyNosEncryptor.encrypt`), as the bulk path already does. Encrypt it there, or Land Search will return no data.
- Dev needs no CORS (Vite proxy). For production, serve the build from Spring Boot (below).

## Ship inside Spring Boot (one jar)
    npm run build
    # copy dist/* into  <spring-project>/src/main/resources/static/
Routes use a hash (`/#/info/ror1b`), so Spring needs no extra routing config.

To automate it, add to `build.gradle`:

    plugins { id 'com.github.node-gradle.node' version '7.1.0' }
    node { download = true; version = '22.11.0'; nodeProjectDir = file('frontend') }
    tasks.register('buildFrontend', NpmTask) { dependsOn npmInstall; args = ['run','build'] }
    processResources { dependsOn buildFrontend; from('frontend/dist') { into 'static' } }

(Place this project in a `frontend/` folder of the Spring repo.)
