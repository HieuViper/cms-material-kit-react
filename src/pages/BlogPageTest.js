import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Checkbox,
  Avatar,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';
import { UserListToolbar } from '../sections/@dashboard/user';
import Scrollbar from '../components/scrollbar/Scrollbar';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPageTest() {
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  console.log(POSTS);
  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog table
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Post
          </Button>
        </Stack>

        {/* <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
        </Card> */}

        <Card sx={{ bgcolor: 'white' }}>
          <Stack m={3} direction="row" alignItems="center" justifyContent="space-between">
            <BlogPostsSearch posts={POSTS} />
            <BlogPostsSort options={SORT_OPTIONS} />
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Checked</TableCell>
                    <TableCell align="left">Title</TableCell>
                    <TableCell align="left">View</TableCell>
                    <TableCell align="left">Comment</TableCell>
                    <TableCell align="left">Share</TableCell>
                    <TableCell align="left">Author</TableCell>
                    <TableCell align="left">Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {POSTS.map((post, index) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar src={post.cover} />
                          <Typography variant="subtitle2" flexWrap={'wrap'}>
                            {post.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{post.view}</TableCell>
                      <TableCell align="left">{post.comment}</TableCell>
                      <TableCell align="left">{post.share}</TableCell>
                      <TableCell align="left">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar src={post.author.avatarUrl} />
                          <Typography variant="subtitle2" flexWrap={'wrap'}>
                            {post.author.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        <Stack>
                          <Typography variant="subtitle2">{post.createdAt.toLocaleDateString()}</Typography>
                          <Typography variant="subtitle2">{post.createdAt.toLocaleTimeString()}</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>

        {/* <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid> */}
      </Container>
    </>
  );
}
