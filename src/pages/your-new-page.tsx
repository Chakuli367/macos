import { CONFIG } from 'src/config-global';


export default function Page() {
  return (
    <>
      <title>{`Your Page - ${CONFIG.appName}`}</title>
      <div>Your content here</div>
    </>
  );
}