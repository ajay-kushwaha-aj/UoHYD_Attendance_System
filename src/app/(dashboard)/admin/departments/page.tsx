"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  Plus,
  Search,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAttendance } from "@/lib/attendance-store";
import { Department, ProfessorProfile } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const KNOWN_SCHOOLS = [
  "School of Life Sciences",
  "School of Computer & Information Sciences",
  "School of Physics",
  "School of Chemistry",
  "School of Mathematics & Statistics",
  "School of Management Studies",
  "School of Engineering Sciences & Technology",
  "School of Humanities",
  "School of Social Sciences",
];

export default function AdminDepartmentsPage() {
  const {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    professors,
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [viewingDept, setViewingDept] = useState<Department | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [school, setSchool] = useState<string>(KNOWN_SCHOOLS[0]);
  const [customSchool, setCustomSchool] = useState<string>("");
  const [hodName, setHodName] = useState<string>("");
  const [hodEmail, setHodEmail] = useState<string>("");
  const [officeLocation, setOfficeLocation] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [establishedYear, setEstablishedYear] = useState<number>(new Date().getFullYear());
  const [totalFaculty, setTotalFaculty] = useState<number>(6);
  const [totalStudents, setTotalStudents] = useState<number>(30);
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Programs Tag Input State
  const [programsList, setProgramsList] = useState<string[]>([]);
  const [newProgramInput, setNewProgramInput] = useState<string>("");

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingDept(null);
    setName("");
    setCode("");
    setSchool(KNOWN_SCHOOLS[0]);
    setCustomSchool("");
    setHodName("");
    setHodEmail("");
    setOfficeLocation("");
    setContactPhone("");
    setEstablishedYear(2015);
    setTotalFaculty(8);
    setTotalStudents(40);
    setDescription("");
    setStatus("ACTIVE");
    setProgramsList(["MSc Systems & Computational Biology"]);
    setNewProgramInput("");
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    if (KNOWN_SCHOOLS.includes(dept.school)) {
      setSchool(dept.school);
      setCustomSchool("");
    } else {
      setSchool("OTHER");
      setCustomSchool(dept.school);
    }
    setHodName(dept.hodName);
    setHodEmail(dept.hodEmail);
    setOfficeLocation(dept.officeLocation);
    setContactPhone(dept.contactPhone || "");
    setEstablishedYear(dept.establishedYear);
    setTotalFaculty(dept.totalFaculty);
    setTotalStudents(dept.totalStudents);
    setDescription(dept.description || "");
    setStatus(dept.status);
    setProgramsList(dept.programs || []);
    setNewProgramInput("");
    setIsFormModalOpen(true);
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgramInput.trim()) return;
    if (!programsList.includes(newProgramInput.trim())) {
      setProgramsList([...programsList, newProgramInput.trim()]);
    }
    setNewProgramInput("");
  };

  const handleRemoveProgram = (progToRemove: string) => {
    setProgramsList(programsList.filter((p: string) => p !== progToRemove));
  };

  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !hodName.trim()) return;

    const resolvedSchool = school === "OTHER" ? (customSchool.trim() || "University School") : school;

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      school: resolvedSchool,
      hodName: hodName.trim(),
      hodEmail: hodEmail.trim().toLowerCase() || `${hodName.trim().toLowerCase().replace(/\s+/g, ".")}@uohyd.ac.in`,
      officeLocation: officeLocation.trim() || "Main Campus Building",
      contactPhone: contactPhone.trim(),
      establishedYear: Number(establishedYear) || 2020,
      totalFaculty: Number(totalFaculty) || 0,
      totalStudents: Number(totalStudents) || 0,
      status,
      description: description.trim(),
      programs: programsList.length > 0 ? programsList : ["Postgraduate Degree Program"],
    };

    if (editingDept) {
      updateDepartment(editingDept.id, payload);
      triggerToast(`Department "${payload.name}" updated successfully!`);
    } else {
      addDepartment(payload);
      triggerToast(`Department "${payload.name}" added to University Registry!`);
    }

    setIsFormModalOpen(false);
  };

  const handleDelete = (id: string, deptName: string) => {
    deleteDepartment(id);
    setDeleteConfirmId(null);
    triggerToast(`Department "${deptName}" was removed.`);
  };

  // Filtered List
  const filteredDepartments = useMemo(() => {
    return departments.filter((d: Department) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.hodName.toLowerCase().includes(q) ||
        d.school.toLowerCase().includes(q) ||
        d.programs.some((p: string) => p.toLowerCase().includes(q));

      const matchesSchool =
        selectedSchoolFilter === "ALL" || d.school === selectedSchoolFilter;

      const matchesStatus =
        statusFilter === "ALL" || d.status === statusFilter;

      return matchesSearch && matchesSchool && matchesStatus;
    });
  }, [departments, searchQuery, selectedSchoolFilter, statusFilter]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalDepts = departments.length;
    const allProgramsCount = departments.reduce(
      (acc: number, d: Department) => acc + (d.programs?.length || 0),
      0
    );
    const totalFac = departments.reduce((acc: number, d: Department) => acc + d.totalFaculty, 0);
    const totalStd = departments.reduce((acc: number, d: Department) => acc + d.totalStudents, 0);
    const uniqueSchools = new Set(departments.map((d: Department) => d.school)).size;

    return { totalDepts, allProgramsCount, totalFac, totalStd, uniqueSchools };
  }, [departments]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{successToast}</div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#8B1D1D]/10 text-[#8B1D1D] text-[11px] font-bold uppercase tracking-wider">
            Dean&apos;s Academic Registry
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            University Departments & Academic Hierarchy
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure academic schools, degree programs, and departmental governance
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-[#8B1D1D] hover:bg-[#721717] text-white font-bold text-xs h-10 px-4 rounded-xl shadow-xs shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Department
        </Button>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-[#8B1D1D]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {stats.totalDepts}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Academic Departments
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {stats.allProgramsCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Degree Programs
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {stats.totalFac}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Appointed Faculty
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {stats.totalStd}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Enrolled Students
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search Bar */}
      <Card className="p-4 border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by department name, code (e.g. SCB), HOD, or degree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]/15 focus:border-[#8B1D1D]"
            />
          </div>

          {/* School Selector */}
          <select
            value={selectedSchoolFilter}
            onChange={(e) => setSelectedSchoolFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]/15 focus:border-[#8B1D1D] cursor-pointer"
          >
            <option value="ALL">All University Schools</option>
            {Array.from(new Set(departments.map((d: Department) => d.school))).map((sch: string) => (
              <option key={sch} value={sch}>
                {sch}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]/15 focus:border-[#8B1D1D] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Departments Grid */}
      {filteredDepartments.length === 0 ? (
        <Card className="p-12 text-center border border-slate-200 bg-white">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No departments match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or clear school filters to view departments.
          </p>
          <Button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedSchoolFilter("ALL");
              setStatusFilter("ALL");
            }}
            variant="outline"
            size="sm"
            className="mt-4 text-xs font-bold"
          >
            Reset All Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredDepartments.map((dept: Department) => {
            const isDeletePending = deleteConfirmId === dept.id;

            return (
              <Card
                key={dept.id}
                className="p-5 sm:p-6 border border-slate-200 bg-white shadow-xs rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Code, Name, School & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-[#8B1D1D]/10 text-[#8B1D1D] font-black text-xs flex items-center justify-center shrink-0 border border-[#8B1D1D]/20">
                        {dept.code}
                      </div>
                      <div>
                        <h2 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#8B1D1D] transition-colors leading-snug">
                          {dept.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="font-medium text-slate-500">
                            {dept.school}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Est. {dept.establishedYear}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
                        dept.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      )}
                    >
                      {dept.status}
                    </span>
                  </div>

                  {/* Governance / HOD Section */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Head of Department (HOD)
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {dept.officeLocation}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {dept.hodName}
                      </div>
                      <div className="text-slate-500 flex items-center gap-3 text-[11px]">
                        <span className="font-mono text-slate-600">
                          {dept.hodEmail}
                        </span>
                        {dept.contactPhone && (
                          <span className="text-slate-400 hidden sm:inline">
                            {dept.contactPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Degree Programs Offered */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Offered Programs ({dept.programs?.length || 0})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dept.programs?.slice(0, 3).map((prog: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-200/60 text-blue-800 text-[11px] font-semibold"
                        >
                          {prog}
                        </span>
                      ))}
                      {dept.programs?.length > 3 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          +{dept.programs.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Stats & Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 text-slate-500 font-medium text-[11px]">
                    <span className="flex items-center gap-1">
                      <strong className="text-slate-800">{dept.totalFaculty}</strong> Faculty
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <strong className="text-slate-800">{dept.totalStudents}</strong> Enrolled Students
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewingDept(dept)}
                      title="View Details"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(dept)}
                      title="Edit Department"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {isDeletePending ? (
                      <div className="flex items-center gap-1 animate-in fade-in">
                        <button
                          type="button"
                          onClick={() => handleDelete(dept.id, dept.name)}
                          className="px-2 py-1 rounded-md bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(dept.id)}
                        title="Delete Department"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================== */}
      {/* ADD / EDIT DEPARTMENT MODAL */}
      {/* ========================================================== */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingDept ? `Edit Department: ${editingDept.code}` : "Register New University Department"}
        description="Enter departmental hierarchy, degree programs, and governance information."
        maxWidth="xl"
      >
        <form onSubmit={handleSaveDepartment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <FormField label="Department Name" required hint="e.g. Department of Systems & Computational Biology">
                <Input
                  type="text"
                  placeholder="Official Department Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-xs font-medium"
                />
              </FormField>
            </div>
            <div>
              <FormField label="Code / Prefix" required hint="2–4 letters (e.g. SCB)">
                <Input
                  type="text"
                  placeholder="SCB"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="text-xs uppercase font-bold"
                />
              </FormField>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FormField label="Affiliated University School" required>
                <select
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]/15 focus:border-[#8B1D1D]"
                >
                  {KNOWN_SCHOOLS.map((sch) => (
                    <option key={sch} value={sch}>
                      {sch}
                    </option>
                  ))}
                  <option value="OTHER">Other School / Center...</option>
                </select>
              </FormField>
            </div>

            {school === "OTHER" && (
              <div>
                <FormField label="Custom School Name" required>
                  <Input
                    type="text"
                    placeholder="Enter custom School or Center"
                    value={customSchool}
                    onChange={(e) => setCustomSchool(e.target.value)}
                    required
                    className="text-xs"
                  />
                </FormField>
              </div>
            )}

            <div>
              <FormField label="Status">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]/15 focus:border-[#8B1D1D]"
                >
                  <option value="ACTIVE">Active (Accredited)</option>
                  <option value="INACTIVE">Inactive (Archived)</option>
                </select>
              </FormField>
            </div>
          </div>

          {/* Governance & Contacts */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Department Governance & Contacts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Head of Department (HOD) Name" required>
                <Input
                  type="text"
                  placeholder="Prof. / Dr. Full Name"
                  value={hodName}
                  onChange={(e) => setHodName(e.target.value)}
                  required
                  className="text-xs"
                />
              </FormField>
              <FormField label="HOD Institutional Email" hint="Leave blank to autogenerate">
                <Input
                  type="email"
                  placeholder="hod@uohyd.ac.in"
                  value={hodEmail}
                  onChange={(e) => setHodEmail(e.target.value)}
                  className="text-xs"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Office Room / Location" hint="e.g. SLS Block Room 204">
                <Input
                  type="text"
                  placeholder="Building, Floor, Room"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="text-xs"
                />
              </FormField>
              <FormField label="Department Phone" hint="e.g. +91 40 2313 4500">
                <Input
                  type="text"
                  placeholder="+91 40 2313 xxxx"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="text-xs"
                />
              </FormField>
            </div>
          </div>

          {/* Programs Tag Input Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Offered Degree Programs
              </label>
              <span className="text-[11px] text-slate-400">
                Press Enter or Add to append
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. MSc Systems & Computational Biology"
                value={newProgramInput}
                onChange={(e) => setNewProgramInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddProgram(e);
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]/15 focus:border-[#8B1D1D]"
              />
              <Button
                type="button"
                onClick={handleAddProgram}
                size="sm"
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {programsList.map((prog: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium"
                >
                  {prog}
                  <button
                    type="button"
                    onClick={() => handleRemoveProgram(prog)}
                    className="hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Capacity and Year */}
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Established Year">
              <Input
                type="number"
                min="1974"
                max="2030"
                value={establishedYear}
                onChange={(e) => setEstablishedYear(Number(e.target.value))}
                className="text-xs"
              />
            </FormField>
            <FormField label="Faculty Members">
              <Input
                type="number"
                min="1"
                value={totalFaculty}
                onChange={(e) => setTotalFaculty(Number(e.target.value))}
                className="text-xs"
              />
            </FormField>
            <FormField label="Student Capacity">
              <Input
                type="number"
                min="1"
                value={totalStudents}
                onChange={(e) => setTotalStudents(Number(e.target.value))}
                className="text-xs"
              />
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Departmental Scope / Overview (Optional)">
            <textarea
              rows={2}
              placeholder="Brief description of research focus, laboratories, or interdisciplinary mandates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D1D]/15 focus:border-[#8B1D1D]"
            />
          </FormField>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFormModalOpen(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#8B1D1D] hover:bg-[#721717] text-white font-bold text-xs cursor-pointer"
            >
              {editingDept ? "Save Changes" : "Create Department"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================== */}
      {/* VIEW DEPARTMENT DETAILS MODAL */}
      {/* ========================================================== */}
      {viewingDept && (
        <Modal
          isOpen={Boolean(viewingDept)}
          onClose={() => setViewingDept(null)}
          title={`${viewingDept.name} (${viewingDept.code})`}
          description={viewingDept.school}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Head of Department</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{viewingDept.hodName}</div>
                <div className="font-mono text-slate-600 mt-0.5">{viewingDept.hodEmail}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Office Location</span>
                <div className="font-medium text-slate-800 mt-0.5">{viewingDept.officeLocation}</div>
                {viewingDept.contactPhone && (
                  <div className="text-slate-500 mt-0.5">{viewingDept.contactPhone}</div>
                )}
              </div>
            </div>

            {viewingDept.description && (
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-700 leading-relaxed">
                {viewingDept.description}
              </div>
            )}

            <div>
              <h4 className="font-bold text-slate-800 mb-2">Degree Programs Offered</h4>
              <div className="space-y-1.5">
                {viewingDept.programs?.map((prog: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800 flex items-center justify-between"
                  >
                    <span>{prog}</span>
                    <Badge variant="active">Active Curriculum</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Faculty List (Matched from store) */}
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Affiliated Faculty in Registry</h4>
              {professors.filter((p: ProfessorProfile) => p.department.toLowerCase().includes(viewingDept.name.toLowerCase()) || p.department.toLowerCase().includes(viewingDept.code.toLowerCase())).length > 0 ? (
                <div className="space-y-2">
                  {professors
                    .filter((p: ProfessorProfile) => p.department.toLowerCase().includes(viewingDept.name.toLowerCase()) || p.department.toLowerCase().includes(viewingDept.code.toLowerCase()))
                    .map((prof: ProfessorProfile) => (
                      <div
                        key={prof.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{prof.fullName}</span>
                          <span className="text-slate-400 text-[11px] ml-2">({prof.designation})</span>
                        </div>
                        <span className="font-mono text-slate-500 text-[11px]">{prof.email}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">No faculty accounts specifically tagged to this department string yet.</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setViewingDept(null)}
                className="cursor-pointer"
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-[#8B1D1D] hover:bg-[#721717] text-white cursor-pointer"
                onClick={() => {
                  const d = viewingDept;
                  setViewingDept(null);
                  handleOpenEditModal(d);
                }}
              >
                Edit Department
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
