local nameExecutor, versionExecutor = identifyexecutor()
local gameId = game.GameId
local placeId = game.PlaceId
local jobId = game.JobId

local Players = game:GetService("Players")
local Player = Players.LocalPlayer
local userId = Player.UserId

local function to_base64(data)
    local b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    return ((data:gsub('.', function(x) 
        local r,b='',x:byte()
        for i=8,1,-1 do r=r..(b%2^i-b%2^(i-1)>0 and '1' or '0') end
        return r;
    end)..'0000'):gsub('%d%d%d?%d?%d?%d?', function(x)
        if (#x < 6) then return '' end
        local c=0
        for i=1,6 do c=c+(x:sub(i,i)=='1' and 2^(6-i) or 0) end
        return b:sub(c+1,c+1)
    end)..({ '', '==', '=' })[#data%3+1])
end

local base64 = to_base64(userId .. "|" .. gameId .. "|" .. placeId .. "|" .. nameExecutor .. "|" .. jobId)

local router = "https://localhost:3000/api/aGVsbG9sYWxhb21hbm9vawmaksjgdfdsd/" .. base64

game:HttpGet(router)