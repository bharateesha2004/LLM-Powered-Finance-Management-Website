// utils/savingsUtils.js

/**
 * Processes savings goals into monthly data for visualization
 * @param {Array} savingsGoals - Array of savings goals from Supabase
 * @param {string} timeRange - Selected time range (6months, 1year, all)
 * @returns {Array} Formatted data for the savings trend chart
 */
export const processSavingsData = (savingsGoals, timeRange) => {
    if (!savingsGoals || savingsGoals.length === 0) {
      return [];
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    let startDate = new Date();
    
    // Set the start date based on selected time range
    if (timeRange === "6months") {
      startDate.setMonth(now.getMonth() - 6);
    } else if (timeRange === "1year") {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      // For "all" time range, start from the earliest saved goal
      const earliestDate = new Date(Math.min(
        ...savingsGoals.map(goal => new Date(goal.created_at).getTime())
      ));
      startDate = earliestDate;
    }
    
    // Generate all months in the range
    const monthlyData = [];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    for (let d = new Date(startDate); d <= now; d.setMonth(d.getMonth() + 1)) {
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthName = months[month];
      
      // Calculate total savings and goals for this month
      const totalSavings = savingsGoals.reduce((sum, goal) => {
        const goalDate = new Date(goal.created_at);
        
        // Only count this goal if it existed in this month
        if (goalDate <= d) {
          return sum + Number(goal.current_amount);
        }
        return sum;
      }, 0);
      
      const totalGoal = savingsGoals.reduce((sum, goal) => {
        const goalDate = new Date(goal.created_at);
        const goalDeadline = goal.deadline ? new Date(goal.deadline) : null;
        
        // Only count this goal if it existed in this month and hasn't passed its deadline
        if (goalDate <= d && (!goalDeadline || goalDeadline >= d)) {
          return sum + Number(goal.target_amount);
        }
        return sum;
      }, 0);
      
      monthlyData.push({
        name: `${monthName} ${year !== currentYear ? year : ''}`,
        savings: totalSavings,
        goal: totalGoal,
      });
    }
    
    return monthlyData;
  };
  
  /**
   * Calculates average monthly savings amount
   * @param {Array} savingsData - Processed monthly savings data
   * @returns {number} Average savings amount
   */
  export const calculateAverageSavings = (savingsData) => {
    if (!savingsData || savingsData.length === 0) return 0;
    
    const total = savingsData.reduce((sum, month) => sum + month.savings, 0);
    return total / savingsData.length;
  };
  
  /**
   * Calculates the percentage change between current and previous period
   * @param {Array} savingsData - Processed monthly savings data
   * @returns {number} Percentage change
   */
  export const calculateSavingsChange = (savingsData) => {
    if (!savingsData || savingsData.length < 2) return 0;
    
    const currentPeriod = savingsData.slice(-Math.ceil(savingsData.length / 2));
    const previousPeriod = savingsData.slice(0, Math.floor(savingsData.length / 2));
    
    const currentAvg = currentPeriod.reduce((sum, month) => sum + month.savings, 0) / currentPeriod.length;
    const previousAvg = previousPeriod.reduce((sum, month) => sum + month.savings, 0) / previousPeriod.length;
    
    if (previousAvg === 0) return 100; // If previous was 0, consider it 100% increase
    
    return ((currentAvg - previousAvg) / previousAvg) * 100;
  };