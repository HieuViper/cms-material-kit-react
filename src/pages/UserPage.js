import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  Modal,
  TextField,
  Select,
  InputLabel,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  // console.log(USERLIST);
  const [name, setName] = useState();
  const [company, setCompany] = useState();
  const [role, setRole] = useState();
  const [verified, setVerified] = useState();
  const [status, setStatus] = useState();
  console.log('🚀 ~ file: UserPage.js:85 ~ UserPage ~ verified', verified);
  console.log('🚀 ~ file: UserPage.js:85 ~ UserPage ~ type verified', typeof verified);
  // For edit

  const [currentSelectUser, setCurrentSelectUser] = useState();
  console.log('🚀 ~ file: UserPage.js:88 ~ UserPage ~ currentSelectUser', currentSelectUser);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [filteredUsersNew, setFilteredUsersNew] = useState([]);
  console.log('🚀 ~ file: UserPage.js:91 ~ UserPage ~ filteredUsersNew day la new', filteredUsersNew);
  const handleOpenEdit = () => {
    setOpenModalEdit(true);
  };

  const tempVariable = { company, name, role, isVerified: verified, status };
  const handleEdit = (e) => {
    setFilteredUsersNew((prev) =>
      prev.map((item) =>
        item.id === currentSelectUser.id && name !== '' && company !== '' && role !== ''
          ? { ...item, ...tempVariable }
          : item
      )
    );
    setOpenModalEdit(false);
    setOpen(null);
  };

  const handleOpenDelete = () => {
    setOpenModalDelete(true);
  };
  const handleCloseEdit = () => {
    setOpenModalEdit(false);
    setOpen(null);
  };

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setCurrentSelectUser(JSON.parse(event.currentTarget.dataset.currentuser));
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);
  // console.log('🚀 ~ file: UserPage.js:166 ~ UserPage ~ filteredUsers', filteredUsers);
  console.log('🚀 ~ file: UserPage.js:91 ~ UserPage ~ filteredUsers', typeof filteredUsers);

  const isNotFound = !filteredUsers.length && !!filterName;

  console.log(filteredUsersNew);
  useEffect(() => {
    setFilteredUsersNew(filteredUsers);
  }, []);

  useEffect(() => {
    if (currentSelectUser) {
      setName(currentSelectUser.name);
      setCompany(currentSelectUser.company);
      setRole(currentSelectUser.role);
      setVerified(currentSelectUser.isVerified);
      setStatus(currentSelectUser.status);
    }
  }, [currentSelectUser]);
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsersNew &&
                    filteredUsersNew.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, role, status, company, avatarUrl, isVerified } = row;
                      const selectedUser = selected.indexOf(name) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={avatarUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{company}</TableCell>

                          <TableCell align="left">{role}</TableCell>

                          <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                          <TableCell align="left">
                            <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={handleOpenMenu}
                              data-currentuser={JSON.stringify(row)}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem sx={{ color: 'info.main' }} onClick={handleOpenEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <Modal
          open={openModalEdit}
          onClose={handleCloseEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editing Modal
            </Typography>
            {currentSelectUser && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                <TextField
                  id=""
                  label="Name"
                  variant="standard"
                  defaultValue={currentSelectUser.name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  id=""
                  label="Company"
                  variant="standard"
                  defaultValue={currentSelectUser.company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <TextField
                  id=""
                  label="Role"
                  variant="standard"
                  defaultValue={currentSelectUser.role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Box>
                  <InputLabel id="select-verified" style={{ fontSize: '12px' }}>
                    Verified
                  </InputLabel>
                  <Select
                    labelId="select-verified"
                    id="demo-simple-select-standard"
                    defaultValue={currentSelectUser.isVerified}
                    onChange={(e) => setVerified(e.target.value)}
                    variant="standard"
                    label="Verified"
                    fullWidth
                  >
                    <MenuItem value>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </Box>

                <Box>
                  <InputLabel id="select-status" style={{ fontSize: '12px' }}>
                    Status
                  </InputLabel>
                  <Select
                    labelId="select-status"
                    id="demo-simple-select-standard"
                    defaultValue={currentSelectUser.status}
                    onChange={(e) => setStatus(e.target.value)}
                    variant="standard"
                    label="Status"
                    fullWidth
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="banned">Banned</MenuItem>
                  </Select>
                </Box>
              </div>
            )}
            <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'end' }}>
              <Button variant="contained" color="info" style={{ marginTop: '20px' }} onClick={handleEdit}>
                Save
              </Button>
              <Button variant="contained" color="error" style={{ marginTop: '20px' }} onClick={handleCloseEdit}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
        <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDelete}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
