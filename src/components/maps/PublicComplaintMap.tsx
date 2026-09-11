import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, MapPin, ThumbsUp, X, ExternalLink, Flame } from 'lucide-react';
import { Complaint } from '../../types';
import { INDIAN_CITIES } from '../../data/locations';
import { COMPLAINT_CATEGORIES } from '../../data/categories';
import { getStatusBadgeInfo, getPriorityBadgeInfo, maskCitizenName } from '../../utils/formatters';
import { getSlaDisplayText } from '../../services/slaEngine';
import { Link } from 'react-router-dom';
import { useComplaints } from '../../contexts/ComplaintContext';

interface PublicComplaintMapProps {
  complaints: Complaint[];
}

export const PublicComplaintMap: React.FC<PublicComplaintMapProps> = ({ complaints }) => {
  const { supportIssue } = useComplaints();
  const [selectedCity, setSelectedCity] = useState(INDIAN_CITIES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [mapMode, setMapMode] = useState<'pins' | 'heatmap'>('pins');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Filter complaints based on selections
  const filteredComplaints = complaints.filter((c) => {
    if (selectedCategory !== 'all' && c.categoryId !== selectedCategory) return false;
    if (selectedStatus === 'overdue' && !c.isOverdue) return false;
    if (selectedStatus !== 'all' && selectedStatus !== 'overdue' && c.status !== selectedStatus) return false;
    if (selectedPriority !== 'all' && c.priority !== selectedPriority) return false;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [selectedCity.defaultLat, selectedCity.defaultLng],
        selectedCity.zoom
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapRef.current = map;
    }
  }, [selectedCity]);

  // Update center when city changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([selectedCity.defaultLat, selectedCity.defaultLng], selectedCity.zoom, {
        duration: 1.2
      });
    }
  }, [selectedCity]);

  // Render markers whenever filtered complaints change
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    filteredComplaints.forEach((complaint) => {
      let color = '#3b82f6'; // blue default
      if (complaint.status === 'resolved') {
        color = '#16a34a'; // green
      } else if (complaint.isOverdue || complaint.priority === 'critical') {
        color = '#dc2626'; // red
      } else if (complaint.status === 'in_progress' || complaint.priority === 'high') {
        color = '#f97316'; // orange
      } else if (complaint.status === 'assigned') {
        color = '#9333ea'; // purple
      }

      if (mapMode === 'heatmap') {
        // Draw density heat circle
        const radius = 250 + Math.min(complaint.supportersCount * 30, 400);
        const circle = L.circle([complaint.latitude, complaint.longitude], {
          radius,
          color,
          fillColor: color,
          fillOpacity: 0.35,
          weight: 2
        });

        circle.on('click', () => {
          setActiveComplaint(complaint);
        });

        circle.addTo(markersGroupRef.current!);
      } else {
        // Standard pin marker
        const customIcon = L.divIcon({
          className: 'custom-status-marker',
          html: `
            <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">
              ${complaint.supportersCount > 1 ? complaint.supportersCount : ''}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([complaint.latitude, complaint.longitude], {
          icon: customIcon
        });

        marker.on('click', () => {
          setActiveComplaint(complaint);
        });

        marker.addTo(markersGroupRef.current!);
      }
    });
  }, [filteredComplaints, mapMode]);

  return (
    <div className="relative w-full h-[650px] rounded-2xl overflow-hidden shadow-elevated border border-slate-200">
      {/* Top Filter Floating Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher: Pins vs Heatmap */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setMapMode('pins')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-colors flex items-center gap-1 ${
                mapMode === 'pins'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-civic-600" />
              <span>Pins</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('heatmap')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs transition-colors flex items-center gap-1 ${
                mapMode === 'heatmap'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Heatmap</span>
            </button>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Navigation className="w-3.5 h-3.5 text-civic-700" />
            <select
              value={selectedCity.city}
              onChange={(e) => {
                const found = INDIAN_CITIES.find((c) => c.city === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-civic-500"
          >
            <option value="all">All Categories ({complaints.length})</option>
            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-civic-500"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="overdue">⚠️ Overdue Only</option>
            <option value="submitted">Recently Submitted</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-civic-500 hidden sm:block"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical Hazard</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
          </select>
        </div>

        {/* Count Pill */}
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{filteredComplaints.length}</span> issues
        </div>
      </div>

      {/* Main Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-slate-200 text-[11px] space-y-1 hidden sm:block">
        <p className="font-bold text-slate-700 mb-1">Issue Status Map</p>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Critical / Overdue</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> In Progress / High</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Assigned to Dept</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Resolved by Officer</div>
      </div>

      {/* Active Complaint Side Drawer Modal on Marker Click */}
      {activeComplaint && (
        <div className="absolute top-16 bottom-4 right-4 z-20 w-80 sm:w-96 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div>
            <div className="p-4 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-civic-400">
                  {activeComplaint.complaintId}
                </span>
                <h4 className="text-sm font-bold mt-0.5 line-clamp-1">{activeComplaint.title}</h4>
              </div>
              <button
                onClick={() => setActiveComplaint(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs max-h-[420px] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded-full font-bold border ${
                    getStatusBadgeInfo(activeComplaint.status).badgeClass
                  }`}
                >
                  {getStatusBadgeInfo(activeComplaint.status).label}
                </span>
                <span className={`px-2 py-0.5 rounded ${getPriorityBadgeInfo(activeComplaint.priority).badgeClass}`}>
                  {getPriorityBadgeInfo(activeComplaint.priority).label}
                </span>
                <span className={`px-2 py-0.5 rounded border ${getSlaDisplayText(activeComplaint).badgeClass}`}>
                  {getSlaDisplayText(activeComplaint).text}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed">{activeComplaint.description}</p>

              <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <p className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-civic-600" /> {activeComplaint.locationAddress}
                </p>
                <p>
                  <strong>Responsible Dept:</strong> {activeComplaint.departmentName || 'Central Registry'}
                </p>
                {activeComplaint.assignedOfficerName && (
                  <p>
                    <strong>Assigned Officer:</strong> {activeComplaint.assignedOfficerName}
                  </p>
                )}
                <p>
                  <strong>Reported By:</strong> {maskCitizenName(activeComplaint.citizenName, activeComplaint.isAnonymous)}
                </p>
              </div>

              {/* Photo preview if exists */}
              {activeComplaint.evidence.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-700 mb-1">Attached Photo:</p>
                  <img
                    src={activeComplaint.evidence[0].mediaUrl}
                    alt="Complaint Evidence"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => supportIssue(activeComplaint.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeComplaint.supportedByMe
                  ? 'bg-civic-600 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${activeComplaint.supportedByMe ? 'fill-white' : ''}`} />
              <span>{activeComplaint.supportersCount} Supports</span>
            </button>

            <Link
              to={`/track/${activeComplaint.complaintId}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
            >
              <span>Track Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
