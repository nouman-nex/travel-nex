import { List } from '@mui/material';
import { ProjectItem } from '../ProjectItem';
import { useEffect } from 'react';

const ProjectsList = ({ coreWorkData }) => {

  return (
    <List disablePadding>
      {coreWorkData?.summary?.appUsage?.map((app, index) => (
        <ProjectItem data={app} key={index} />
      ))}
    </List>
  );
};

export { ProjectsList };
