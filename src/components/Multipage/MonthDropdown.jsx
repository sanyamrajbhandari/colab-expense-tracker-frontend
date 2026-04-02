import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "/src/css/MonthDropdown.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MonthDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Feb");
  const [year, setYear] = useState(2026);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullMonthName = new Date(`${selectedMonth} 1, ${year}`).toLocaleString('default', { month: 'long' });

  return (
    <div className="month-dropdown-container" ref={dropdownRef}>
      <div className="month-dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span>{fullMonthName} {year}</span>
        <FiChevronDown className="dropdown-icon" />
      </div>

      {isOpen && (
        <div className="month-dropdown-menu">
          <div className="month-dropdown-header">
            <button onClick={() => setYear(year - 1)} className="year-btn">
              <FiChevronLeft className="year-icon" />
            </button>
            <span className="year-text">{year}</span>
            <button onClick={() => setYear(year + 1)} className="year-btn">
              <FiChevronRight className="year-icon" />
            </button>
          </div>
          <div className="month-grid">
            {months.map(month => (
              <button 
                key={month} 
                className={`month-btn ${selectedMonth === month ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedMonth(month);
                  setIsOpen(false);
                }}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthDropdown;
