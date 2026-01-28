/**
 * Data Processing Utilities
 */
class DataProcessor {
    static parseHistory(history, videos) {
        // Create video lookup
        const videoLookup = {};
        if (videos && Array.isArray(videos)) {
            videos.forEach(v => {
                const id = v._id || v.id;
                if (id) {
                    videoLookup[id] = {
                        duration: v.duration || 0,
                        title: v.title || 'Unknown',
                        level: v.level || 'Unknown'
                    };
                }
            });
        }

        // Parse history entries
        return history.map(entry => {
            const videoId = entry.id || entry.videoId || entry._id;
            const videoInfo = videoLookup[videoId] || {};
            
            const watchedAt = entry.lastWatched || entry.watchedAt || entry.date;
            const date = watchedAt ? new Date(watchedAt) : null;
            
            return {
                videoId,
                title: videoInfo.title || entry.title || 'Unknown',
                duration: videoInfo.duration || entry.duration || 0,
                durationMinutes: (videoInfo.duration || 0) / 60,
                durationHours: (videoInfo.duration || 0) / 3600,
                watchedAt: date,
                date: date ? date.toISOString().split('T')[0] : null,
                level: videoInfo.level || entry.level || 'Unknown',
                hour: date ? date.getHours() : null,
                dayOfWeek: date ? date.getDay() : null
            };
        }).filter(entry => entry.date); // Filter out entries without dates
    }

    static createDailySummary(history) {
        const dailyMap = {};
        
        history.forEach(entry => {
            if (!entry.date) return;
            
            if (!dailyMap[entry.date]) {
                dailyMap[entry.date] = {
                    date: entry.date,
                    totalSeconds: 0,
                    totalMinutes: 0,
                    totalHours: 0,
                    videosWatched: 0
                };
            }
            
            dailyMap[entry.date].totalSeconds += entry.duration || 0;
            dailyMap[entry.date].totalMinutes += entry.durationMinutes || 0;
            dailyMap[entry.date].totalHours += entry.durationHours || 0;
            dailyMap[entry.date].videosWatched += 1;
        });

        // Convert to array and sort by date
        return Object.values(dailyMap)
            .map(day => ({
                ...day,
                totalHours: day.totalSeconds / 3600,
                totalMinutes: day.totalSeconds / 60
            }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((day, index, arr) => ({
                ...day,
                cumulativeHours: arr.slice(0, index + 1).reduce((sum, d) => sum + d.totalHours, 0)
            }));
    }

    static calculateTodayHours(history) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Convert UTC to Eastern Time
        const easternTime = new Date(today.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const todayEastern = easternTime.toISOString().split('T')[0];
        
        return history
            .filter(entry => {
                if (!entry.watchedAt) return false;
                const entryDate = new Date(entry.watchedAt);
                const entryEastern = new Date(entryDate.toLocaleString('en-US', { timeZone: 'America/New_York' }));
                return entryEastern.toISOString().split('T')[0] === todayEastern;
            })
            .reduce((sum, entry) => sum + (entry.durationMinutes || 0), 0);
    }

    static calculateStats(dailyData, history, totalHours) {
        const totalVideos = history.length;
        const totalActiveDays = dailyData.length;
        
        // Calculate streak
        const sortedDates = dailyData.map(d => d.date).sort().reverse();
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        for (let i = 0; i < sortedDates.length; i++) {
            const date = new Date(sortedDates[i]);
            const nextDate = i > 0 ? new Date(sortedDates[i - 1]) : null;
            
            if (i === 0 && sortedDates[i] === todayStr) {
                currentStreak = 1;
            } else if (nextDate) {
                const diffDays = Math.floor((date - nextDate) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    if (i === 1) currentStreak = 2;
                    else currentStreak++;
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
        
        // Calculate velocity
        const totalMinutes = dailyData.reduce((sum, d) => sum + d.totalMinutes, 0);
        const avgDailyMinutes = totalActiveDays > 0 ? totalMinutes / totalActiveDays : 0;
        
        // Last 7 days
        const last7Days = dailyData.slice(-7);
        const last7DaysMinutes = last7Days.reduce((sum, d) => sum + d.totalMinutes, 0);
        const last7DaysAvg = last7Days.length > 0 ? last7DaysMinutes / last7Days.length : 0;
        
        // Determine current level
        const milestones = [
            { name: 'Newbie', hours: 0 },
            { name: 'Beginner 1', hours: 50 },
            { name: 'Beginner 2', hours: 150 },
            { name: 'Intermediate 1', hours: 300 },
            { name: 'Intermediate 2', hours: 600 },
            { name: 'Intermediate 3', hours: 900 },
            { name: 'Advanced 1', hours: 1200 },
            { name: 'Advanced 2', hours: 1500 }
        ];
        
        let currentLevel = 'Newbie';
        let nextLevel = 'Beginner 1';
        let progressToNext = 0;
        let hoursToNext = 50;
        
        for (let i = milestones.length - 1; i >= 0; i--) {
            if (totalHours >= milestones[i].hours) {
                currentLevel = milestones[i].name;
                if (i < milestones.length - 1) {
                    nextLevel = milestones[i + 1].name;
                    hoursToNext = milestones[i + 1].hours - totalHours;
                    progressToNext = ((totalHours - milestones[i].hours) / (milestones[i + 1].hours - milestones[i].hours)) * 100;
                }
                break;
            }
        }
        
        return {
            totalHours,
            totalVideos,
            totalActiveDays,
            currentStreak,
            longestStreak,
            avgDailyMinutes,
            last7DaysAvg,
            currentLevel,
            nextLevel,
            progressToNext,
            hoursToNext,
            consistencyScore: totalActiveDays > 0 ? (totalActiveDays / Math.ceil((new Date() - new Date(sortedDates[sortedDates.length - 1])) / (1000 * 60 * 60 * 24))) * 100 : 0
        };
    }
}
