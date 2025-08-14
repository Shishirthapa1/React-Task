import React, { useState } from "react";
import { DataTable, DatePicker, FileUpload, Modal, SelectInput, TextInput } from "../components";
import type { Column, Pagination } from "../utils/types";
import { Link } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith1", email: "jane1@example.com" },
    { id: 3, name: "Jane Smith2", email: "jane2@example.com" },
    { id: 4, name: "Jane Smith3", email: "jane3@example.com" },
    { id: 5, name: "Jane Smith4", email: "jane4@example.com" },
    { id: 6, name: "Jane Smith5", email: "jane5@example.com" },
  ]);
  const columns: Column<User>[] = [
    { key: "name", label: "Full Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
  ];
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

  const [date, setDate] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedFruit, setSelectedFruit] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const selectOptions = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "orange", label: "Orange" },
  ];

  const handleSort = (key: string, direction: "asc" | "desc" | null) => {
    setSortKey(key);
    setSortDir(direction);
    setPage(1);
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortKey || !sortDir) return users;

    return [...users].sort((a, b) => {
      const aVal = a[sortKey as keyof User];
      const bVal = b[sortKey as keyof User];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [users, sortKey, sortDir]);

  const paginatedUsers = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, page, pageSize]);

  const pagination: Pagination = {
    page,
    pageSize,
    total: users.length,
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="flex flex-row justify-between pt-2 pb-6">
        <h1 className="text-3xl font-bold text-indigo-700 tracking-wide">Component Library</h1>
        <div className="flex flex-row gap-4 items-center justify-center">
          <Link to="/cart">
            <button className="cursor-pointer bg-indigo-700 text-white rounded-md px-3 py-2">Go to Cart</button>
          </Link>
          <Link to="/user-list">
            <button className="cursor-pointer bg-indigo-700 text-white rounded-md px-3 py-2">Go to User-List</button>
          </Link>
        </div>
      </div>

      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2 text-indigo-800">
          Data Table
        </h2>
        <DataTable
          data={paginatedUsers}
          columns={columns}
          pagination={pagination}
          onSort={handleSort}
          onPageChange={setPage}
          loading={false}
          theme={{
            primaryColor: "#2563eb",       // Tailwind's blue-600
            secondaryColor: "#f1f5f9",     // Tailwind's slate-100
            fontFamily: "Arial, sans-serif",
            borderRadius: "8px",
            spacing: {
              small: "4px",
              medium: "8px",
              large: "16px"
            }
          }}
          features={{
            showPagination: true,          // enable pagination UI
            allowSorting: true,            // enable sorting
            showSearch: true,              // enable search bar
            exportData: true,              // enable export

          }}
        />

      </section>

      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2 text-indigo-800">Date Picker</h2>
        <DatePicker
          id="dob"
          label="Date of Birth"
          required
          value={date}
          onChange={(val) => setDate(val)}
          helperText="Select your birth date"
        />
        {date && <p className="mt-3 text-gray-600">Selected date: <strong>{date}</strong></p>}
      </section>

      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2 text-indigo-800">File Upload</h2>
        <FileUpload
          label="Upload your document"
          accept=".pdf,.doc,.docx"
          onChange={(f) => {
            setFile(f);
            console.log("Selected file:", f);
          }}
          helperText="Supported formats: pdf, doc, docx"
        />
        {file && (
          <p className="mt-3 text-gray-600">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}
      </section>

      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2 text-indigo-800">Text Input</h2>
        <TextInput
          id="name"
          label="Name"
          placeholder="Enter your name"
          required
          helperText="This is a helper text"
          onChange={(value) => console.log("Name changed:", value)}
        />
      </section>

      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2 text-indigo-800">Select Input</h2>
        <SelectInput
          label="Choose a fruit"
          options={selectOptions}
          value={selectedFruit}
          onChange={(val) => setSelectedFruit(val)}
          helperText="Pick your favorite fruit"
          required
        />
      </section>

      <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b border-indigo-300 pb-2 text-indigo-800">Modal Open</h2>
        <button
          type="button"
          className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-shadow shadow-md focus:outline-none cursor-pointer focus:ring-2 focus:ring-indigo-400"
          onClick={() => setModalOpen(true)}
        >
          Open Modal
        </button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modal Component">
          <div className="flex items-center justify-center">
            <p className="text-red-500 text-xl font-semibold capitalize">This modal is open.</p>
          </div>
        </Modal>
      </section>
    </div>
  );
};

export default Home;
