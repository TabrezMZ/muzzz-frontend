import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import {
  useGetPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} from "../features/playlist/playlistApi";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Playlists = () => {
  const { data, isLoading, error } = useGetPlaylistsQuery(null);
  const [createPlaylist] = useCreatePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [updatePlaylist] = useUpdatePlaylistMutation();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");

  const theme = useTheme();

  const handleOpen = () => {
    setIsEdit(false);
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  const handleEditOpen = (playlist: any) => {
    setIsEdit(true);
    setEditingId(playlist._id);
    setForm({ name: playlist.name, description: playlist.description || "" });
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setForm({ name: "", description: "" });
    setFormError("");
    setEditingId(null);
    setIsEdit(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleCreateOrUpdate = async () => {
    if (!form.name.trim()) {
      setFormError("Playlist name is required");
      return;
    }
    try {
      if (isEdit && editingId) {
        await updatePlaylist({ id: editingId, data: form }).unwrap();
      } else {
        await createPlaylist(form).unwrap();
      }
      handleClose();
    } catch (err) {
      setFormError("Failed to save playlist");
    }
  };

  const handleDelete = async (id: string) => {
    await deletePlaylist(id);
  };

  return (
    <Box maxWidth="md" mx="auto" px={{ xs: 2, sm: 4 }} py={4}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={3}
      >
        <Typography variant="h4">Playlists</Typography>
        <Button variant="contained" onClick={handleOpen}>
          + Add Playlist
        </Button>
      </Box>

      {error ? (
        <Typography color="error">Failed to load playlists</Typography>
      ) : isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <List>
          {data?.data?.map((playlist: any) => (
            <ListItem
              key={playlist._id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                px: 1,
                py: 2,
                borderBottom: "1px solid #333",
              }}
            >
              <ListItemText
                primary={playlist.name}
                secondary={playlist.description}
                sx={{ width: "100%" }}
              />

              <Stack
                direction="row"
                spacing={1}
                sx={{ alignSelf: "flex-start" }}
              >
                <IconButton
                  onClick={() => handleEditOpen(playlist)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(playlist._id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
                <Button
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                  size="small"
                  variant="outlined"
                >
                  View
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      )}

      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          p={4}
          bgcolor="background.paper"
          sx={{
            width: { xs: "90%", sm: 400 },
            mx: "auto",
            mt: "10%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            {isEdit ? "Edit Playlist" : "Create New Playlist"}
          </Typography>
          <TextField
            label="Playlist Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!formError}
            helperText={formError}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCreateOrUpdate}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Playlists;
