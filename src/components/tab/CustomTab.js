import { Box, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import React from 'react';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CustomTab = ({ header, bodies }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // header.map((item) => console.log(item[0]));
  // console.log(bodies);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {header &&
            header.map((item) => <Tab key={item[0].idx} label={item[0].language} {...a11yProps(item[0].idx)} />)}
        </Tabs>
      </Box>
      {/* <Box></Box> */}
      {bodies &&
        bodies.map((item, index) => (
          <TabPanel key={index} value={value} index={index}>
            {item}
          </TabPanel>
        ))}
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default CustomTab;
