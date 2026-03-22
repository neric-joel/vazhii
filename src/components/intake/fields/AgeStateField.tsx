interface AgeStateFieldProps {
  age: number;
  state: string;
  onChange: (age: number, state: string) => void;
}

export function AgeStateField({ age, state, onChange }: AgeStateFieldProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1C1C1A] mb-2"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          Let's start with the basics
        </h2>
        <p className="text-[#6B6A65] text-sm">
          This helps us find programs you're age-eligible for right now.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#1C1C1A] mb-2" htmlFor="age">
            How old are you?
          </label>
          <input
            id="age"
            type="number"
            min={14}
            max={30}
            value={age || ''}
            onChange={e => onChange(parseInt(e.target.value) || 0, state)}
            placeholder="Enter your age"
            className="w-full px-4 py-3 rounded-xl border border-[#E2DED6] bg-white
                       text-[#1C1C1A] text-base
                       focus:outline-none focus:ring-2 focus:ring-[#0F6E56] focus:border-transparent
                       placeholder:text-[#6B6A65]/60
                       min-h-[48px] transition-shadow"
          />
          {age > 0 && age >= 22 && (
            <p className="mt-2 text-xs text-[#D85A30] font-medium">
              ⚠️ Age 22+: The Tuition Waiver requires your first disbursement before age 23. Apply as soon as possible.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1C1C1A] mb-2" htmlFor="state">
            What state are you in?
          </label>
          <select
            id="state"
            value={state}
            onChange={e => onChange(age, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E2DED6] bg-white
                       text-[#1C1C1A] text-base
                       focus:outline-none focus:ring-2 focus:ring-[#0F6E56] focus:border-transparent
                       min-h-[48px] transition-shadow appearance-none cursor-pointer"
          >
            <option value="">Select your state</option>
            <option value="Arizona">Arizona</option>
            <option value="Other">Other state</option>
          </select>
          {state === 'Other' && (
            <p className="mt-2 text-xs text-[#6B6A65]">
              Path Forward is currently focused on Arizona programs. The assessment will show federal programs available everywhere.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
