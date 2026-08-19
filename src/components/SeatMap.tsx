import React from 'react';
import { SeatInfo, SeatStatus } from '../types';
import { UserCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface SeatMapProps {
  totalSeats: number;
  seats: SeatInfo[];
  selectedSeatNumbers: number[];
  onToggleSeat: (seatNumber: number) => void;
  readOnly?: boolean;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  totalSeats,
  seats,
  selectedSeatNumbers,
  onToggleSeat,
  readOnly = false
}) => {
  const bookedCount = seats.filter(s => s.status === 'booked' || s.status === 'blocked').length;
  const availableCount = totalSeats - bookedCount;

  const maleBookedCount = seats.filter(s => s.bookedBy?.gender === 'male').length;
  const femaleBookedCount = seats.filter(s => s.bookedBy?.gender === 'female').length;
  const targetHalf = Math.floor(totalSeats / 2);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-2xl">
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>1:1 Social Ratio Target</span>
            </span>
          </div>
          <h4 className="text-base font-bold font-display text-white flex items-center space-x-2">
            <span>🚌 Vehicle Seat Selection Map</span>
            <span className="text-xs font-normal text-slate-400">({totalSeats} Seats)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Select your seat. Blue (♂) & Pink (♀) badges indicate co-travelers to maintain an balanced group dynamic.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <div className="bg-sky-950/80 border border-sky-500/40 text-sky-300 px-3 py-1.5 rounded-xl flex items-center space-x-1">
            <span>♂ {maleBookedCount}</span>
          </div>
          <div className="bg-pink-950/80 border border-pink-500/40 text-pink-300 px-3 py-1.5 rounded-xl flex items-center space-x-1">
            <span>♀ {femaleBookedCount}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl">
            {availableCount} Left
          </div>
        </div>
      </div>

      {/* 1:1 Social Balance Progress Bar */}
      <div className="my-4 bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-sky-400 flex items-center space-x-1">
            <span>♂ Male Travelers: {maleBookedCount}</span>
          </span>
          <span className="text-emerald-400 text-[10px] uppercase tracking-wider">Group Balance Goal (1:1 Ratio)</span>
          <span className="text-pink-400 flex items-center space-x-1">
            <span>♀ Female Travelers: {femaleBookedCount}</span>
          </span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
          <div style={{ width: `${(maleBookedCount / (totalSeats || 1)) * 100}%` }} className="bg-sky-500 h-full transition-all"></div>
          <div style={{ width: `${(availableCount / (totalSeats || 1)) * 100}%` }} className="bg-slate-700 h-full transition-all"></div>
          <div style={{ width: `${(femaleBookedCount / (totalSeats || 1)) * 100}%` }} className="bg-pink-500 h-full transition-all"></div>
        </div>
      </div>

      {/* Legend */}
      <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px]">
            1
          </div>
          <span className="text-slate-300">Available</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
            ✓
          </div>
          <span className="text-emerald-400">Selected</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-lg bg-sky-950 border border-sky-600/50 text-sky-400 flex items-center justify-center text-[10px]">
            ♂
          </div>
          <span className="text-sky-300">Booked (Male)</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-lg bg-pink-950 border border-pink-600/50 text-pink-400 flex items-center justify-center text-[10px]">
            ♀
          </div>
          <span className="text-pink-300">Booked (Female)</span>
        </div>
      </div>

      {/* Vehicle Seat Layout Container */}
      <div className="bg-slate-950 border border-slate-700 rounded-3xl p-4 sm:p-5 shadow-inner relative overflow-x-auto">
        <div className="min-w-[280px]">
        
        {/* Front Dashboard & Driver Cabin */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
            FRONT WINDSHIELD
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1 rounded-xl text-xs text-amber-400 border border-amber-400/20 font-bold">
            <span>☸ Driver Seat</span>
          </div>
        </div>

        {/* 2D Bus Seat Grid */}
        <div className="space-y-3">
          {Array.from({ length: Math.ceil((totalSeats - 4) / 4) + 1 }).map((_, rowIndex) => {
            const isLastRow = rowIndex === Math.ceil((totalSeats - 4) / 4);
            const rowSeatNumbers = isLastRow
              ? [totalSeats - 3, totalSeats - 2, totalSeats - 1, totalSeats]
              : [rowIndex * 4 + 1, rowIndex * 4 + 2, rowIndex * 4 + 3, rowIndex * 4 + 4];

            return (
              <div key={rowIndex} className="flex items-center justify-between space-x-2">
                {/* Left Side (Window & Aisle) */}
                <div className="flex space-x-2">
                  {[rowSeatNumbers[0], rowSeatNumbers[1]].map((seatNum) => {
                    if (!seatNum || seatNum > totalSeats) return <div key={seatNum} className="w-11 h-11" />;
                    const seat = seats.find(s => s.seatNumber === seatNum);
                    const isSelected = selectedSeatNumbers.includes(seatNum);
                    const isBooked = seat?.status === 'booked' || seat?.status === 'blocked';
                    const gender = seat?.bookedBy?.gender;

                    return (
                      <button
                        key={seatNum}
                        type="button"
                        disabled={readOnly || isBooked}
                        onClick={() => onToggleSeat(seatNum)}
                        className={`w-11 h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all relative group ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300'
                            : isBooked
                            ? gender === 'female'
                              ? 'bg-pink-950/80 border border-pink-500/50 text-pink-300 cursor-not-allowed'
                              : 'bg-sky-950/80 border border-sky-500/50 text-sky-300 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50'
                        }`}
                      >
                        <span>{seatNum}</span>
                        {isBooked && (
                          <span className="text-[9px] font-extrabold opacity-80">
                            {gender === 'female' ? '♀' : '♂'}
                          </span>
                        )}
                        {seat?.isWindow && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" title="Window Seat"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Center Aisle Indicator */}
                {!isLastRow && (
                  <div className="text-[10px] uppercase font-bold text-slate-600 tracking-tighter">
                    AISLE
                  </div>
                )}

                {/* Right Side (Aisle & Window) */}
                <div className="flex space-x-2">
                  {[rowSeatNumbers[2], rowSeatNumbers[3]].map((seatNum) => {
                    if (!seatNum || seatNum > totalSeats) return <div key={seatNum} className="w-11 h-11" />;
                    const seat = seats.find(s => s.seatNumber === seatNum);
                    const isSelected = selectedSeatNumbers.includes(seatNum);
                    const isBooked = seat?.status === 'booked' || seat?.status === 'blocked';
                    const gender = seat?.bookedBy?.gender;

                    return (
                      <button
                        key={seatNum}
                        type="button"
                        disabled={readOnly || isBooked}
                        onClick={() => onToggleSeat(seatNum)}
                        className={`w-11 h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all relative group ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300'
                            : isBooked
                            ? gender === 'female'
                              ? 'bg-pink-950/80 border border-pink-500/50 text-pink-300 cursor-not-allowed'
                              : 'bg-sky-950/80 border border-sky-500/50 text-sky-300 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50'
                        }`}
                      >
                        <span>{seatNum}</span>
                        {isBooked && (
                          <span className="text-[9px] font-extrabold opacity-80">
                            {gender === 'female' ? '♀' : '♂'}
                          </span>
                        )}
                        {seat?.isWindow && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" title="Window Seat"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

        {/* Rear Exit / Trunk Banner */}
        <div className="mt-6 pt-3 border-t border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
            REAR LUGGAGE COMPARTMENT & EMERGENCY EXIT
          </span>
        </div>

        </div>
      </div>

      {/* Selected Seats Footer Bar */}
      {selectedSeatNumbers.length > 0 && (
        <div className="mt-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-bold text-white">
                Selected Seat(s): <span className="text-emerald-400">#{selectedSeatNumbers.sort((a,b)=>a-b).join(', #')}</span>
              </p>
              <p className="text-slate-400 text-[11px]">{selectedSeatNumbers.length} seat(s) reserved for checkout</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
