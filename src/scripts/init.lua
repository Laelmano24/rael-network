local x5 = "a491c082"
local s5 = "e3b7"
local g7 = "9fd13a72e"
local m8 = "7c92f84dbe"
local b2 = "d5e1"
local h8 = "fa97b32"
local c3 = "b84a6f12cc"
local kj = "3cde91f7"
local d4 = "8ab71d59"
local mpp = "f417b"
local nkk = "e8c37d59a6b1"
local f6 = "c3a5b8f49d271e"
local xp8 = "d19f83b27"
local a1 = "f7246ad"
local ol = "8ecb1f2"
local e5 = "b61a9"

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

local function from_base64(data)
    local b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    data = string.gsub(data, '[^'..b..'=]', '')
    return (data:gsub('.', function(x)
        if (x == '=') then return '' end
        local r,f='',(b:find(x)-1)
        for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and '1' or '0') end
        return r;
    end):gsub('%d%d%d?%d?%d?%d?%d?%d?', function(x)
        if (#x ~= 8) then return '' end
        local c=0
        for i=1,8 do c=c+(x:sub(i,i)=='1' and 2^(8-i) or 0) end
        return string.char(c)
    end))
end

local function table_concat(t, sep, i, j)
    sep = sep or ""
    i = i or 1
    j = j or #t
    local result = ""
    for index = i, j do
        local value = t[index]
        if value ~= nil then
            result = result .. tostring(value)
            if index < j then
                result = result .. sep
            end
        end
    end
    return result
end

local function string_sub(s, i, j)
    if i == nil then i = 1 end
    if j == nil then j = -1 end
    local len = #s
    if i < 0 then i = len + 1 + i end
    if j < 0 then j = len + 1 + j end
    if i < 1 then i = 1 end
    if j > len then j = len end

    if i > len or i > j then
        return ""
    end

    local parts = {}
    for k = i, j do
        local b = string.byte(s, k)
        if not b then break end
        parts[#parts + 1] = string.char(b)
    end
    return table_concat(parts)
end

local function Istrimgfind(str, sub)
    for i = 1, #str - #sub + 1 do
        if string_sub(str, i, i + #sub - 1) == sub then
            return i, i + #sub - 1
        end
    end
    return nil
end

local function Encrypted(text, key)
    local salt = math.random(0, 255)
    local result = string.char(salt)
    for i = 1, #text do
        local desloc = key:byte(((i - 1) % #key) + 1) + salt
        result = result .. string.char((text:byte(i) + desloc) % 256)
    end
    return to_base64(result)
end

local function Decrypted(text, key)
    local decode = from_base64(text)
    local salt = decode:byte(1)
    local result = ""
    for i = 2, #decode do
        local desloc = key:byte(((i - 2) % #key) + 1) + salt
        result = result .. string.char((decode:byte(i) - desloc + 256) % 256)
    end
    return result
end

local _env = getgenv()
local ws = _env.WebSocket.connect("ws://rael-network.shardweb.app/")
local gameId = game.GameId
local nameExecutor, versionExecutor = _env.identifyexecutor and _env.identifyexecutor()

local TweenService = game:GetService("TweenService")
local CoreGui = game:GetService("CoreGui")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local PlayerGui = (_env.gethui and _env.gethui()) or CoreGui
local Character = LocalPlayer.Character or LocalPlayer.CharacterAdded:Wait()

if shared.eventCharacter then shared.eventCharacter:Disconnect(); shared.eventCharacter = nil end
shared.eventCharacter = LocalPlayer.CharacterAdded:Connect(function(character)
    Character = character
end)

local function crashPlayer(message)
    task.delay(1, function()
        while true do local n = 1 + math.random(99999) end
    end)
    LocalPlayer:Kick(message)
end

local isAnnouncement = PlayerGui:FindFirstChild("Announcement rael")
if isAnnouncement then isAnnouncement:Destroy() end

local announcement = Instance.new("ScreenGui")
announcement.Name = "Announcement rael"
announcement.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
announcement.Parent = PlayerGui

local background = Instance.new("Frame")
background.Name = "Background"
background.AnchorPoint = Vector2.new(0.5, 0)
background.Position = UDim2.new(0.5, 0, 0, 50)
background.Size = UDim2.new(0.8, 0, 0, 51)
background.Visible = false
background.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
background.BackgroundTransparency = 1
background.BorderSizePixel = 1
background.BorderColor3 = Color3.fromRGB(0, 0, 0)
background.Parent = announcement

local corner = Instance.new("UICorner")
corner.Parent = background

local stroke = Instance.new("UIStroke")
stroke.Thickness = 3
stroke.Color = Color3.fromRGB(17, 165, 101)
stroke.Parent = background

local title = Instance.new("TextLabel")
title.Name = "Title"
title.AnchorPoint = Vector2.new(0.5, 0)
title.Position = UDim2.new(0.5, 0, 0, 0)
title.Size = UDim2.new(1, 0, 0, 50)
title.BackgroundTransparency = 1
title.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
title.BorderSizePixel = 0
title.BorderColor3 = Color3.fromRGB(0, 0, 0)
title.Text = "Como vai você?"
title.TextColor3 = Color3.fromRGB(255, 255, 255)
title.TextSize = 20
title.TextWrapped = true
title.FontFace = Font.new("rbxasset://fonts/families/Roboto.json", Enum.FontWeight.Heavy, Enum.FontStyle.Normal)
title.Parent = background

local function showMessage(text)

    title.Text = text
    background.Visible = true
    background.BackgroundTransparency = 1

    local tweenInfo = TweenInfo.new(0.8, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
    TweenService:Create(background, tweenInfo, {BackgroundTransparency = 0.2}):Play()
    TweenService:Create(stroke, tweenInfo, {Transparency = 0}):Play()
    TweenService:Create(title, tweenInfo, {TextTransparency = 0}):Play()

    task.wait(5)

    TweenService:Create(background, tweenInfo, {BackgroundTransparency = 1}):Play()
    TweenService:Create(stroke, tweenInfo, {Transparency = 1}):Play()
    TweenService:Create(title, tweenInfo, {TextTransparency = 1}):Play()

end

ws.OnMessage:Connect(function(message)

    local output = Decrypted(message, x5 .. s5 .. m8 .. kj .. mpp .. nkk .. xp8 .. ol)

    if Istrimgfind(output, "[USER KICK] ") and not Istrimgfind(output, "[SERVER MESSAGE]") then

        local startPos = Istrimgfind(output, "[USER KICK] ")
        if startPos then
            local username = string_sub(output, startPos + #"[USER KICK] ")
            return crashPlayer("Você foi chutado por " .. username)
        end

    end

    if Istrimgfind(output, "[USER KILL] ") and not Istrimgfind(output, "[SERVER MESSAGE]") then

        local startPos = Istrimgfind(output, "[USER KILL] ")
        local humanoid = Character:FindFirstChild("Humanoid")
        if startPos and humanoid then
            local username = string_sub(output, startPos + #"[USER KILL] ")
            humanoid.Health = 0
            showMessage("Kill by " .. username)
        end

    end

    if Istrimgfind(output, "[SERVER MESSAGE] ") then

        local startPos = Istrimgfind(output, "[SERVER MESSAGE] ")
        if startPos then
            local message = string_sub(output, startPos + #"[SERVER MESSAGE] ")
            return showMessage(message)
        end

    end

end)

ws:Send(tostring(Encrypted(LocalPlayer.UserId .. "|" .. gameId .. "|" .. nameExecutor, x5 .. s5 .. m8 .. kj .. mpp .. nkk .. xp8 .. ol)))