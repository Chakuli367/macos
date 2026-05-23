// src/layouts/MentorWrapperLayout.jsx
import MentorLayer from 'src/mentor/MentorLayer';
import { Outlet } from 'react-router-dom';

export default function MentorWrapperLayout() {
  return (
    <>
      <MentorLayer />   {/* omnipresent mentor */}
      <Outlet />        {/* renders all child routes */}
    </>
  );
}
                          